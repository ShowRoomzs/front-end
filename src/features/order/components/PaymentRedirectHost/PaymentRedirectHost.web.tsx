import { useEffect } from "react";

import { toast } from "@/common/providers/ToastProvider";
import { navigationRef } from "@/common/router/navigationRef";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { clearPendingOrder } from "@/features/order/hooks/useCheckoutPayment";
import { invalidateOrderQueries } from "@/features/order/hooks/useOrderQueries";
import { claimService } from "@/features/order/services/claimService";
import { orderService } from "@/features/order/services/orderService";
import { PortOneClientResult } from "@/features/order/types/payment";
import { isClaimPaymentId, PAYMENT_REDIRECT_PATH } from "@/features/order/web/paymentRedirect";

const READY_POLL_COUNT = 3;
const READY_POLL_INTERVAL_MS = 1500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** 내비게이션이 준비될 때까지 기다렸다가 이동한다 — 복귀 직후엔 아직 화면 트리가 서지 않았다 */
async function navigateWhenReady(navigate: () => void) {
  for (let i = 0; i < 40 && !navigationRef.isReady(); i++) {
    await sleep(100);
  }
  if (navigationRef.isReady()) {
    navigate();
  }
}

type Destination =
  | { screen: typeof COMMON_ROUTES.ORDER_DETAIL; params: { orderId: number } }
  | { screen: typeof COMMON_ROUTES.CLAIM_DETAIL; params: { claimId: number } }
  | { screen: typeof COMMON_ROUTES.CART; params?: undefined };

function openCommon(destination: Destination) {
  void navigateWhenReady(() => navigationRef.navigate(ROOT_ROUTES.COMMON, destination));
}

/** 주문 결제 — 앱 C9의 판정(useCheckoutPayment)과 같은 기준으로 서버 응답만 보고 정한다 */
async function resolveOrderPayment(paymentId: string, clientResult: PortOneClientResult) {
  for (let attempt = 0; attempt <= READY_POLL_COUNT; attempt++) {
    const result = await orderService.completePayment(paymentId, clientResult);

    if (result.orderStatus === "PAID" && result.paymentStatus === "PAID") {
      void clearPendingOrder();
      invalidateOrderQueries({ includeCart: true });
      openCommon({ screen: COMMON_ROUTES.ORDER_DETAIL, params: { orderId: result.orderId } });
      return;
    }
    if (result.orderStatus === "EXPIRED") {
      void clearPendingOrder();
      toast.show(result.failReason ?? "주문 시간이 만료됐어요. 다시 주문해 주세요.");
      openCommon({ screen: COMMON_ROUTES.CART });
      return;
    }
    if (result.paymentStatus === "CANCEL_REQUESTED" || result.paymentStatus === "CANCELLED_MISMATCH") {
      void clearPendingOrder();
      toast.show(`${result.failReason ?? "결제가 자동으로 취소되었어요."} 결제 금액은 자동으로 환불돼요.`);
      openCommon({ screen: COMMON_ROUTES.CART });
      return;
    }
    // 실패 · 취소(결제사 화면에서 닫음) — 주문 화면 상태가 사라졌으니 장바구니에서 다시 시작한다
    if (result.paymentStatus === "FAILED" || (result.paymentStatus === "READY" && clientResult.code)) {
      toast.show(result.failReason ?? "결제가 완료되지 않았어요. 다시 시도해 주세요.");
      openCommon({ screen: COMMON_ROUTES.CART });
      return;
    }
    if (attempt < READY_POLL_COUNT) {
      await sleep(READY_POLL_INTERVAL_MS);
    } else {
      // 승인 반영이 늦다 — 웹훅이 뒤이어 완료시키므로 주문 상세에서 본다(앱 PENDING과 같다)
      openCommon({ screen: COMMON_ROUTES.ORDER_DETAIL, params: { orderId: result.orderId } });
    }
  }
}

/** 반품 · 교환 배송비 결제(`clm-`) */
async function resolveClaimPayment(paymentId: string) {
  const result = await claimService.completePayment(paymentId);
  const claimId = result.claimIds[0];

  if (result.paymentStatus !== "PAID") {
    toast.show("배송비 결제가 완료되지 않았어요. 다시 시도해 주세요.");
  }
  invalidateOrderQueries();
  if (claimId) {
    openCommon({ screen: COMMON_ROUTES.CLAIM_DETAIL, params: { claimId } });
  }
}

/**
 * 모바일 브라우저 결제의 복귀 지점(`/payment/redirect?paymentId=…&code=…`)을 처리한다.
 *
 * 결제창을 띄운 화면은 리디렉션으로 사라졌으므로 그 화면의 콜백 대신 여기서 서버 확정 API를 부르고
 * 결과 화면(주문 상세 · 반품교환 상세 · 실패면 장바구니)으로 보낸다. 쿼리의 `code`는 힌트일 뿐 판정은 서버가 한다.
 * 주소창에는 쿼리를 남기지 않는다 — 새로고침으로 확정이 두 번 불리지 않게.
 */
export default function PaymentRedirectHost() {
  useEffect(() => {
    if (window.location.pathname !== PAYMENT_REDIRECT_PATH) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("paymentId");
    const clientResult: PortOneClientResult = {
      code: params.get("code"),
      message: params.get("message"),
      txId: params.get("txId"),
    };

    window.history.replaceState(null, "", "/");
    if (!paymentId) {
      return;
    }

    const resolve = isClaimPaymentId(paymentId)
      ? resolveClaimPayment(paymentId)
      : resolveOrderPayment(paymentId, clientResult);

    resolve.catch(() => {
      toast.show("결제 결과를 확인하지 못했어요. 주문 내역에서 확인해 주세요.");
    });
  }, []);

  return null;
}
