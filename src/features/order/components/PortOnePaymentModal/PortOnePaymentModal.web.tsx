import * as PortOne from "@portone/browser-sdk/v2";
import { useEffect, useRef } from "react";

import { PaymentWindow, PortOneClientResult } from "@/features/order/types/payment";
import { getPaymentRedirectUrl } from "@/features/order/web/paymentRedirect";

/**
 * 포트원 결제창 (웹) — 앱의 RN SDK는 WebView 위에서 돌아 웹에서는 뜨지 않는다. 포트원 **브라우저 SDK**로 연다.
 *
 * - **PC:** 결제사 기본 창(KCP는 페이지 안 iframe)이 뜨고, 끝나면 프로미스로 결과가 온다 → 앱과 같은 `onComplete`.
 * - **모바일 브라우저:** 결제사 페이지로 **이동**했다가 `/payment/redirect`로 돌아온다. 이 화면은 그때 사라지므로
 *   결과 처리는 `PaymentRedirectHost`가 맡는다(서버 확정 → 주문 · 반품교환 상세로).
 *
 * 창 유형(windowType)은 정하지 않는다 — 결제사마다 되는 조합이 달라 포트원 기본값을 따른다.
 * 판정은 앱과 같이 하지 않는다 — `code`는 힌트이고 부르는 쪽이 서버 확정 API를 부른다.
 */
interface PortOnePaymentModalProps {
  payment: PaymentWindow | null;
  onComplete: (paymentId: string, result: PortOneClientResult) => void;
  onError: (paymentId: string, error: Error) => void;
  onClose: (paymentId: string) => void;
}

/** 서버의 평평한 `payment` 블록 → 브라우저 SDK 요청(앱 `toPortOneRequest`와 같은 옮김 + 리디렉션 주소) */
function toBrowserRequest(payment: PaymentWindow) {
  return {
    storeId: payment.storeId,
    channelKey: payment.channelKey,
    paymentId: payment.paymentId,
    orderName: payment.orderName,
    totalAmount: payment.totalAmount,
    currency: payment.currency,
    payMethod: payment.payMethod,
    ...(payment.payMethod === "CARD" && payment.cardCompany
      ? { card: { cardCompany: payment.cardCompany } }
      : {}),
    ...(payment.payMethod === "EASY_PAY" && payment.easyPayProvider
      ? { easyPay: { easyPayProvider: payment.easyPayProvider } }
      : {}),
    customer: {
      fullName: payment.customer.fullName,
      phoneNumber: payment.customer.phoneNumber,
      ...(payment.customer.email ? { email: payment.customer.email } : {}),
    },
    redirectUrl: getPaymentRedirectUrl(),
  } as unknown as Parameters<typeof PortOne.requestPayment>[0];
}

export default function PortOnePaymentModal(props: PortOnePaymentModalProps) {
  const { payment, onComplete, onError } = props;
  const callbacks = useRef({ onComplete, onError });
  /** 같은 paymentId로 결제창을 두 번 열지 않는다 — 다시 그려져도 한 번만 */
  const openedPaymentId = useRef<string | null>(null);

  callbacks.current = { onComplete, onError };

  useEffect(() => {
    if (!payment || openedPaymentId.current === payment.paymentId) {
      return;
    }
    const { paymentId } = payment;

    openedPaymentId.current = paymentId;

    PortOne.requestPayment(toBrowserRequest(payment))
      .then(response => {
        // 리디렉션으로 떠난 경우엔 여기 오지 않는다(이 페이지가 사라진다)
        if (!response) {
          return;
        }
        callbacks.current.onComplete(paymentId, {
          code: response.code ?? null,
          message: response.message ?? null,
          txId: response.txId ?? null,
        });
      })
      .catch((error: unknown) => {
        callbacks.current.onError(paymentId, error instanceof Error ? error : new Error(String(error)));
      });
  }, [payment]);

  // 결제창은 포트원이 페이지 위에 직접 그린다 — 여기서 그릴 화면은 없다
  return null;
}
