/**
 * 웹 결제 리디렉션 — 모바일 브라우저는 결제사 페이지로 **이동**했다가 이 경로로 돌아온다(PC는 페이지 안 결제창).
 * 돌아오면 앱이 처음부터 다시 뜨므로 결제창을 띄운 화면의 상태가 없다 — `PaymentRedirectHost`가 쿼리만 보고
 * 서버 확정 API를 부른 뒤 결과 화면으로 보낸다.
 */
export const PAYMENT_REDIRECT_PATH = "/payment/redirect";

export function getPaymentRedirectUrl() {
  return `${window.location.origin}${PAYMENT_REDIRECT_PATH}`;
}

/** 반품·교환 배송비 결제는 `clm-`로 시작한다 — 확정 API가 다르다(주문 확정 API로 보내면 404) */
export function isClaimPaymentId(paymentId: string) {
  return paymentId.startsWith("clm-");
}
