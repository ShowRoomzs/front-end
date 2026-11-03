import axios, { isAxiosError } from "axios";

import { apiInstance } from "@/common/lib/apiInstance";

/**
 * 본인인증(PASS · KCP 휴대폰 본인확인) — C0-2 회원가입 · C15-2 재인증이 같이 쓴다(BE 57 설계서 3절).
 *
 * 흐름: 시작 API가 인증 id · 상점 · 채널을 발급한다 → 그 값 그대로 포트원 인증창을 띄운다 → 창이 끝나면
 * 성공 · 실패를 가리지 않고 완료 API를 부른다. **판정은 서버가** 포트원에 직접 물어 한다(만 14세 · 명의 중복).
 * 앱은 포트원 키를 들고 있지 않다 — 테스트 → 운영 채널 전환은 서버 설정만 바뀐다.
 *
 * 채널 계약 전 서버는 가짜 게이트웨이를 붙여 둔다. 그때 내려오는 채널 키는 실제 창을 열 수 없으니
 * 창을 건너뛰고 바로 완료를 부른다 — 서버가 고정 인물로 통과시킨다.
 */
export type IdentityVerificationPurpose = "SIGNUP" | "REVERIFY";

export type IdentityVerificationResult =
  | { status: "SUCCESS" }
  /** 만 14세 미만 — 법령상 가입 불가(C0 1d) */
  | { status: "AGE_RESTRICTED" }
  /** 창 닫힘 · 시간 초과 · 통신사 불일치 · 명의 중복을 한데 묶는다(C0 1e). 사용자에게는 "다시 하면 된다"가 중요하다 */
  | { status: "FAILED"; reason?: string };

/** 포트원 인증창 요청 — 시작 API가 준 값 그대로다 */
export interface IdentityVerificationWindow {
  storeId: string;
  channelKey: string;
  identityVerificationId: string;
}

/** 인증창이 돌려준 값 — 서버는 기록만 하고 판정에 쓰지 않는다. 창을 닫았으면 null */
export interface IdentityVerificationSdkResult {
  identityVerificationTxId?: string;
  code?: string;
  pgCode?: string;
}

/** 서버 `FakeIdentityGateway.CHANNEL_KEY` — 실제 인증창을 열 수 없는 채널 */
const FAKE_CHANNEL_KEY = "channel-key-fake-identity";

/**
 * 가입 단계는 accessToken이 아니라 registerToken을 쓴다. apiInstance는 저장된 accessToken을 덮어쓰고
 * 401이면 리프레시를 시도하므로, 가입용 요청은 따로 보낸다.
 */
const signupInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1`,
});

const PATH = "/user/identity-verifications";

function post<T>(url: string, body: unknown, registerToken?: string) {
  return registerToken
    ? signupInstance.post<T>(url, body, { headers: { Authorization: `Bearer ${registerToken}` } })
    : apiInstance.post<T>(url, body);
}

/** 실제 인증창을 띄워야 하는가 — 가짜 게이트웨이면 창 없이 완료로 넘어간다 */
export function needsPassWindow(window: IdentityVerificationWindow) {
  return window.channelKey !== FAKE_CHANNEL_KEY;
}

/** 서버 오류 코드를 화면 분기로 — 403 `UNDER_MIN_AGE`만 따로, 나머지는 「다시 인증하기」 */
export function toVerificationResult(error: unknown): IdentityVerificationResult {
  const code = isAxiosError(error)
    ? (error.response?.data as { code?: string } | undefined)?.code
    : undefined;

  if (code === "UNDER_MIN_AGE") {
    return { status: "AGE_RESTRICTED" };
  }
  return { status: "FAILED", reason: code };
}

/** 시작 — 1분 안에 같은 용도로 다시 부르면 서버가 같은 id를 돌려준다(연타 멱등) */
export async function startIdentityVerification(
  purpose: IdentityVerificationPurpose,
  registerToken?: string
): Promise<IdentityVerificationWindow> {
  const { data } = await post<IdentityVerificationWindow>(PATH, { purpose }, registerToken);

  return {
    storeId: data.storeId,
    channelKey: data.channelKey,
    identityVerificationId: data.identityVerificationId,
  };
}

/** 완료 — 서버가 포트원을 조회해 판정한다. 성공하면 10분 안에 가입 · 재인증 API를 불러야 한다 */
export async function completeIdentityVerification(
  identityVerificationId: string,
  sdkResult: IdentityVerificationSdkResult | null,
  registerToken?: string
): Promise<IdentityVerificationResult> {
  try {
    await post(`${PATH}/${identityVerificationId}/complete`, sdkResult ?? {}, registerToken);

    return { status: "SUCCESS" };
  } catch (error) {
    return toVerificationResult(error);
  }
}
