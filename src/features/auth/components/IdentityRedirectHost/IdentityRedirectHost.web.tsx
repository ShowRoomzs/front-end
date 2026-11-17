import { useEffect } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { toast } from "@/common/providers/ToastProvider";
import { navigationRef } from "@/common/router/navigationRef";
import {
  AUTH_ROUTES,
  HOME_ROUTES,
  MYPAGE_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from "@/common/router/routes";
import {
  completeIdentityVerification,
  IdentityVerificationResult,
  IdentityVerificationSdkResult,
} from "@/features/auth/services/identityVerificationService";
import {
  IDENTITY_REDIRECT_PATH,
  IdentityRedirectContext,
  takeIdentityRedirectContext,
} from "@/features/auth/web/identityRedirect";
import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";

/**
 * 처음 들어온 주소 — 모듈을 읽는 시점(앱이 그려지기 전)에 잡는다. 내비게이션이 첫 화면을 그리면서 주소를 `/`로
 * 바꾸므로(linking.ts가 복귀 주소를 홈으로 읽는다) effect에서 `window.location`을 읽으면 이미 늦다
 */
const ENTRY_LOCATION = { pathname: window.location.pathname, search: window.location.search };

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 내비게이션이 준비될 때까지 기다렸다가 이동한다 — 복귀 직후엔 아직 화면 트리가 서지 않았다.
 * 첫 한 박자는 늘 쉰다 — 같은 커밋의 바깥 effect(토스트 등록)가 아직 돌지 않았다
 */
async function navigateWhenReady(navigate: () => void) {
  await sleep(0);
  for (let i = 0; i < 40 && !navigationRef.isReady(); i++) {
    await sleep(100);
  }
  if (navigationRef.isReady()) {
    navigate();
  }
}

/**
 * 가입 — 앱 C0-2(`IdentityVerifyView.routeByResult`)와 같은 갈래로 보낸다. 로그인 창을 연 화면의
 * 「로그인하면 이어서 할 일」(onSuccessLogin)은 페이지를 떠나며 사라졌으므로 가입을 마치면 홈에 남는다.
 */
function continueSignup(result: IdentityVerificationResult, registerToken: string) {
  const screen =
    result.status === "AGE_RESTRICTED"
      ? { screen: AUTH_ROUTES.AGE_RESTRICTED }
      : {
          screen: result.status === "FAILED" ? AUTH_ROUTES.VERIFY_FAILED : AUTH_ROUTES.SIGN_UP,
          params: { registerToken },
        };

  // 인증 스택은 `{ params: { onSuccessLogin } }`로 여는 타입이라 하위 화면 지정은 타입 밖에서 넘긴다(linking.ts와 같은 사정)
  void navigateWhenReady(() => navigationRef.navigate(ROOT_ROUTES.AUTH, screen as never));
}

/** 회원정보 재인증 — 앱 C15-2(`MemberInfoChangeView.handleReverify`)와 같게 확정 후 회원정보 화면으로 */
async function continueReverify(result: IdentityVerificationResult) {
  if (result.status === "SUCCESS") {
    try {
      const accountInfo = await settingService.reverifyIdentity(true);

      queryClient.setQueryData([SETTING_QUERY_KEY.ACCOUNT_INFO], accountInfo);
      toast.success("회원정보가 최신 정보로 갱신되었어요");
    } catch {
      toast.show("본인인증에 실패했어요. 잠시 후 다시 시도해 주세요");
    }
  } else {
    toast.show("본인인증에 실패했어요. 잠시 후 다시 시도해 주세요");
  }
  void navigateWhenReady(() =>
    navigationRef.navigate(ROOT_ROUTES.HOME, {
      screen: HOME_ROUTES.MYPAGE,
      params: {
        screen: MYPAGE_ROUTES.SETTINGS,
        params: { screen: SETTINGS_ROUTES.MEMBER_INFO_CHANGE },
      },
    } as never)
  );
}

async function resolveRedirect(context: IdentityRedirectContext, sdkResult: IdentityVerificationSdkResult) {
  const result = await completeIdentityVerification(
    context.identityVerificationId,
    sdkResult,
    context.registerToken
  );

  if (context.purpose === "SIGNUP" && context.registerToken) {
    continueSignup(result, context.registerToken);
    return;
  }
  await continueReverify(result);
}

/**
 * 모바일 브라우저 본인인증의 복귀 지점(`/identity/redirect?identityVerificationId=…&code=…`)을 처리한다.
 *
 * 인증창을 띄운 화면은 리디렉션으로 사라졌으므로 창을 열기 전에 적어 둔 목적 · 가입 토큰을 꺼내 서버 완료 API를 부르고,
 * 앱과 같은 다음 화면으로 보낸다. 쿼리의 `code`는 힌트일 뿐 판정은 서버가 한다.
 * 주소창에는 쿼리를 남기지 않는다 — 새로고침으로 완료가 두 번 불리지 않게(결제 `PaymentRedirectHost`와 같다).
 */
export default function IdentityRedirectHost() {
  useEffect(() => {
    if (ENTRY_LOCATION.pathname !== IDENTITY_REDIRECT_PATH) {
      return;
    }
    const params = new URLSearchParams(ENTRY_LOCATION.search);
    const identityVerificationId = params.get("identityVerificationId");
    const sdkResult: IdentityVerificationSdkResult = {
      identityVerificationTxId: params.get("identityVerificationTxId") ?? undefined,
      code: params.get("code") ?? undefined,
      pgCode: params.get("pgCode") ?? undefined,
    };

    if (window.location.pathname === IDENTITY_REDIRECT_PATH) {
      window.history.replaceState(null, "", "/");
    }

    const context = identityVerificationId ? takeIdentityRedirectContext(identityVerificationId) : null;

    if (!context) {
      // 토스트는 감싸는 ToastProvider의 effect가 등록한다 — 자식인 이 effect가 먼저 돌아 바로 띄우면 버려진다
      void navigateWhenReady(() =>
        toast.show("본인인증 결과를 이어받지 못했어요. 처음부터 다시 시도해 주세요")
      );
      return;
    }
    resolveRedirect(context, sdkResult).catch(() => {
      toast.show("본인인증에 실패했어요. 잠시 후 다시 시도해 주세요");
    });
  }, []);

  return null;
}
