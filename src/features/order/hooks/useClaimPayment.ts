import { useCallback, useRef, useState } from "react";

import { claimService } from "@/features/order/services/claimService";
import { ClaimPaymentCompleteResponse } from "@/features/order/types/claim";
import { PaymentWindow } from "@/features/order/types/payment";

/**
 * 반품·교환 배송비 결제(교환 재발송비 · 반려 상품 재발송비) — 서버 「결제 연동 앱 전달사항」 3-8.
 *
 * 결제창 재료는 주문 결제와 같은 모양이지만 **확정 API가 다르다** — `clm-` 결제는
 * `/v1/user/claims/payments/{paymentId}/complete`로 보낸다(주문 결제 확정으로 보내면 404).
 * 결제창이 끝나면 결과와 관계없이 확정을 부르고, 판정은 서버 응답으로만 한다.
 */
export type ClaimPaymentOutcome =
  | { type: "PAID"; result: ClaimPaymentCompleteResponse }
  /** 창 닫음 · 실패 — 입력 내용은 그대로 두고 다시 시도한다 */
  | { type: "NOT_PAID" }
  /** 서버가 자동 취소했다(금액 불일치 · 요청이 지워짐) — 돈은 자동 환불된다 */
  | { type: "CANCELLED"; requestExpired: boolean };

export function useClaimPayment(options: { onOutcome: (outcome: ClaimPaymentOutcome) => void }) {
  const [paymentWindow, setPaymentWindow] = useState<PaymentWindow | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const onOutcomeRef = useRef(options.onOutcome);

  onOutcomeRef.current = options.onOutcome;

  const confirm = useCallback(async (paymentId: string) => {
    setPaymentWindow(null);
    setIsConfirming(true);
    try {
      const result = await claimService.completePayment(paymentId);

      if (result.paymentStatus === "PAID") {
        onOutcomeRef.current({ type: "PAID", result });
      } else if (result.paymentStatus === "CANCEL_REQUESTED" || result.paymentStatus === "CANCELLED") {
        onOutcomeRef.current({ type: "CANCELLED", requestExpired: result.claimIds.length === 0 });
      } else {
        onOutcomeRef.current({ type: "NOT_PAID" });
      }
    } catch {
      onOutcomeRef.current({ type: "NOT_PAID" });
    } finally {
      setIsConfirming(false);
    }
  }, []);

  return { paymentWindow, openPaymentWindow: setPaymentWindow, isConfirming, confirm };
}
