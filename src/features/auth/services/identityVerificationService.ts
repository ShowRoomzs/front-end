import { isAxiosError } from "axios";

import { apiInstance } from "@/common/lib/apiInstance";

/**
 * C0-2 본인인증 (PASS) — 포트원 V2 본인인증(`@portone/react-native-sdk`의 `IdentityVerification`).
 *
 * 흐름: 앱이 인증 id를 만들어 포트원 인증창(PASS · 통신사)을 띄운다 → 창이 끝나면 **서버가** 포트원 API로
 * 결과(실명 · 생년월일 · 성별 · 연락처 · CI/DI)를 조회해 가입 토큰에 묶고, 만 14세 미만이면 막는다.
 * 앱은 인증창의 결과를 믿지 않는다 — 나이 판정과 저장은 서버가 한다.
 *
 * ⚠️ 2026-10-26 현재 서버는 PASS 연동 전이다(`IdentityVerificationService.verify`가 임시 데이터를 돌려준다).
 * 본인인증 채널 키 · 결과 확인 API가 생기기 전까지는 **외부에서 인증을 마쳤다고 가정**하고 성공을 돌려준다.
 * 준비가 끝나면 `PASS_SERVER_READY`를 true로 바꾸고 .env에 채널 키를 넣는다 — 화면 · 라우팅은 그대로다.
 */
export type IdentityVerificationResult =
  | { status: "SUCCESS" }
  /** 만 14세 미만 — 법령상 가입 불가 */
  | { status: "AGE_RESTRICTED" }
  /** 시간 초과 · 인증 창 닫힘 · 통신사 불일치를 한데 묶는다. 사용자에게는 "다시 하면 된다"가 중요하다 */
  | { status: "FAILED"; reason?: string };

/** 포트원 인증창 요청 — 상점 · 채널은 공개 식별자라 앱이 들고 있어도 된다(비밀 키는 서버만) */
export interface IdentityVerificationWindow {
  storeId: string;
  channelKey: string;
  identityVerificationId: string;
}

/** 서버가 본인인증 결과 확인 API를 열었는가 — 열리면 true로 바꾼다(백엔드 요청 목록 참고) */
const PASS_SERVER_READY = false;

const STORE_ID = process.env.EXPO_PUBLIC_PORTONE_STORE_ID ?? "";
const IDENTITY_CHANNEL_KEY = process.env.EXPO_PUBLIC_PORTONE_IDENTITY_CHANNEL_KEY ?? "";

/** PASS 대기 모달이 잠깐이라도 보여야 하므로, 목업은 즉시 반환하지 않고 짧게 둔다 */
const MOCK_DELAY_MS = 600;

/** 실제 PASS 창을 띄울 수 있는가 — 서버 확인 API와 채널 키가 모두 있어야 한다 */
export function isPassReady() {
  return PASS_SERVER_READY && !!STORE_ID && !!IDENTITY_CHANNEL_KEY;
}

/** 인증 id는 앱이 만든다 — 포트원이 같은 id의 재사용을 막아 한 번의 인증에 한 번만 쓰인다 */
export function createIdentityVerificationWindow(): IdentityVerificationWindow {
  const random = Math.random().toString(36).slice(2, 10);

  return {
    storeId: STORE_ID,
    channelKey: IDENTITY_CHANNEL_KEY,
    identityVerificationId: `identity-verification-${Date.now()}-${random}`,
  };
}

/** 서버 준비 전 — 외부에서 인증을 마쳤다고 가정한다 */
export async function mockIdentityVerification(): Promise<IdentityVerificationResult> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  return { status: "SUCCESS" };
}

/**
 * 인증창이 끝난 뒤 서버에 결과 확인을 맡긴다 — 서버가 포트원에서 결과를 조회해 가입 토큰에 묶는다.
 * 경로 · 응답은 백엔드 요청으로 제안한 모양이다(`POST /v1/auth/identity-verifications/{id}/confirm`).
 */
export async function confirmIdentityVerification(
  registerToken: string,
  identityVerificationId: string
): Promise<IdentityVerificationResult> {
  try {
    await apiInstance.post(`/auth/identity-verifications/${identityVerificationId}/confirm`, {
      registerToken,
    });

    return { status: "SUCCESS" };
  } catch (error) {
    const code = isAxiosError(error)
      ? (error.response?.data as { code?: string } | undefined)?.code
      : undefined;

    if (code === "UNDER_MIN_AGE") {
      return { status: "AGE_RESTRICTED" };
    }
    return { status: "FAILED", reason: code };
  }
}
