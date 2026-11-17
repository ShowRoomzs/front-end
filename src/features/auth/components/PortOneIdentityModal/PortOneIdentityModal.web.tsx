import * as PortOne from "@portone/browser-sdk/v2";
import { useEffect, useRef } from "react";

import {
  IdentityVerificationSdkResult,
  IdentityVerificationWindow,
} from "@/features/auth/services/identityVerificationService";
import { getIdentityRedirectUrl } from "@/features/auth/web/identityRedirect";

/**
 * 포트원 본인인증창 (웹) — 앱의 RN SDK는 WebView 위에서 돌아 웹에서는 뜨지 않는다. 포트원 **브라우저 SDK**로 연다
 * (결제창 `PortOnePaymentModal.web`과 같은 방식).
 *
 * - 창이 페이지 위에서 끝나면(PC) 프로미스로 결과가 온다 → 앱과 같은 `onFinish`.
 * - 통신사 페이지로 **이동**하는 경우(모바일 브라우저)는 `/identity/redirect`로 돌아온다. 이 화면은 그때 사라지므로
 *   이어 가기는 `IdentityRedirectHost`가 맡는다(가입 토큰은 `useIdentityVerification`이 창을 열기 전에 적어 둔다).
 *
 * 창 유형(windowType)은 정하지 않는다 — 결제사마다 되는 조합이 달라 포트원 기본값을 따른다.
 * 판정은 하지 않는다 — 창이 돌려준 값을 넘기면 서버가 포트원에 물어 판정한다.
 */
interface PortOneIdentityModalProps {
  /** null이면 닫힌 상태 */
  request: IdentityVerificationWindow | null;
  /** 인증창이 끝남 — 사용자가 닫았거나 창이 오류로 끝났으면 null */
  onFinish: (result: IdentityVerificationSdkResult | null) => void;
}

export default function PortOneIdentityModal(props: PortOneIdentityModalProps) {
  const { request, onFinish } = props;
  const onFinishRef = useRef(onFinish);
  /** 같은 요청으로 창을 두 번 열지 않는다 — 서버가 1분 안의 재시도에 같은 id를 돌려주므로 id가 아니라 요청 객체로 가린다 */
  const opened = useRef<IdentityVerificationWindow | null>(null);

  onFinishRef.current = onFinish;

  useEffect(() => {
    if (!request || opened.current === request) {
      return;
    }
    opened.current = request;

    PortOne.requestIdentityVerification({
      storeId: request.storeId,
      channelKey: request.channelKey,
      identityVerificationId: request.identityVerificationId,
      redirectUrl: getIdentityRedirectUrl(),
    })
      .then(response => {
        // 리디렉션으로 떠나는 경우 — 결과는 돌아온 페이지(`IdentityRedirectHost`)가 처리한다. 여기서 완료를 부르면
        // 인증이 끝나기도 전에 서버가 실패로 판정한다
        if (!response) {
          return;
        }
        onFinishRef.current({
          identityVerificationTxId: response.identityVerificationTxId,
          code: response.code,
          pgCode: response.pgCode,
        });
      })
      .catch(() => onFinishRef.current(null));
  }, [request]);

  // 인증창은 포트원이 페이지 위에 직접 그린다 — 여기서 그릴 화면은 없다
  return null;
}
