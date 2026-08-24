/**
 * C0-2 본인인증 (PASS).
 *
 * ⚠️ PASS는 아직 도입 전이다. 지금은 **외부에서 인증을 마쳤다고 가정**하고 성공을 돌려준다.
 *
 * 실제 연동이 들어올 자리를 이 파일 하나로 좁혀 둔 이유는, 화면 쪽에 mock 분기를 흩뿌리면
 * 나중에 어디를 고쳐야 하는지 찾기 어렵기 때문이다. PASS SDK가 붙으면
 * `requestIdentityVerification()` 내부만 바꾸면 되고, 화면·라우팅은 그대로 둔다.
 *
 * 결과 타입도 지금 미리 갖춰 둔다 — 만 14세 미만 차단(C0 1d)과 인증 실패(C0 1e) 화면이
 * 이 반환값에 따라 갈리며, 실물이 붙는 순간 두 화면이 그대로 살아난다.
 */
export type IdentityVerificationResult =
  | { status: "SUCCESS" }
  /** 만 14세 미만 — 법령상 가입 불가 */
  | { status: "AGE_RESTRICTED" }
  /** 시간 초과 · 인증 창 닫힘 · 통신사 불일치를 한데 묶는다. 사용자에게는 "다시 하면 된다"가 중요하다 */
  | { status: "FAILED"; reason?: string };

/** PASS 앱을 여는 대기 모달이 잠깐이라도 보여야 하므로, 즉시 반환하지 않고 짧게 둔다 */
const MOCK_DELAY_MS = 600;

export async function requestIdentityVerification(): Promise<IdentityVerificationResult> {
  // TODO: PASS SDK 연동. 인증 창을 띄우고 결과를 받아 status로 변환한다.
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  return { status: "SUCCESS" };
}
