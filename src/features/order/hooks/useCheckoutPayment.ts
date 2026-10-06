import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { ASYNC_STORAGE } from "@/common/constants/asyncStorage";
import { invalidateOrderQueries } from "@/features/order/hooks/useOrderQueries";
import { orderService } from "@/features/order/services/orderService";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentCompleteResponse,
} from "@/features/order/types/order";
import { PaymentSelection, PaymentWindow, PortOneClientResult } from "@/features/order/types/payment";
import { resolveErrorCode, resolveHttpStatus, toKstEpoch } from "@/features/order/utils/orderFormat";

/**
 * C9 결제 흐름 — 주문 생성 → 결제창 → 결과 확정(서버 「결제 연동 앱 전달사항」 2절).
 *
 * 지키는 규칙(같은 문서 7절):
 * - 금액은 앱이 만들지 않는다 — `expectedTotalAmount`는 주문서 값을 그대로 보낸다.
 * - 멱등키는 **새 주문마다 새로, 재전송에는 그대로** — 네트워크 오류·502로 응답을 못 받은 요청은
 *   같은 키로 다시 보내야 서버가 같은 주문을 돌려준다. 새 키로 보내면 재고가 30분 더 잡힌다.
 * - 주문이 살아 있으면(실패·창 닫음 뒤) **새 주문이 아니라 재시도 API**로 결제창만 다시 연다.
 * - `expiresAt` 5분 전부터 결제를 잠근다 — 만료 직전에 결제하면 승인 도중 만료돼 자동 환불된다.
 * - 확정은 결과와 관계없이 부르고, 판정은 서버 응답으로만 한다.
 * - `orderId`·`paymentId`를 저장해 두고, 앱이 앞으로 돌아오면 상세를 다시 읽는다(웹훅이 먼저 완료했을 수 있다).
 */
const EXPIRY_LOCK_MS = 5 * 60 * 1000;
const READY_POLL_COUNT = 3;
const READY_POLL_INTERVAL_MS = 1500;

export type CheckoutPaymentOutcome =
  /** 결제 완료 — 주문 상세로 */
  | { type: "PAID"; orderId: number }
  /** 결제되지 않음 — C9에 머무르고 재시도할 수 있다 */
  | { type: "NOT_PAID"; message: string }
  /** 승인 반영이 늦다 — 웹훅이 뒤이어 완료시키므로 주문 상세로 보낸다 */
  | { type: "PENDING"; orderId: number }
  /** 주문이 닫혔다(만료 · 자동 취소) — 주문서부터 다시 */
  | { type: "CLOSED"; message: string };

interface PendingOrder {
  orderId: number;
  expiresAt: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function savePending(orderId: number, paymentId: string) {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE.PENDING_ORDER, JSON.stringify({ orderId, paymentId }));
  } catch {
    // 저장 실패는 결제를 막지 않는다 — 복귀 보조 장치일 뿐이다
  }
}

export async function clearPendingOrder() {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE.PENDING_ORDER);
  } catch {
    // 무시
  }
}

export function useCheckoutPayment(options: { onOutcome: (outcome: CheckoutPaymentOutcome) => void }) {
  const { onOutcome } = options;

  const [paymentWindow, setPaymentWindow] = useState<PaymentWindow | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const pendingOrder = useRef<PendingOrder | null>(null);
  /** 응답을 못 받은 주문 생성의 키 — 다음 탭에서 그대로 재전송한다 */
  const unsentKey = useRef<string | null>(null);
  const onOutcomeRef = useRef(onOutcome);

  onOutcomeRef.current = onOutcome;

  const resetPending = useCallback(() => {
    pendingOrder.current = null;
    unsentKey.current = null;
    void clearPendingOrder();
  }, []);

  /** 만료 5분 전부터는 같은 주문으로 결제하지 않는다 */
  const isPendingExpiring = useCallback(() => {
    const expiresAt = toKstEpoch(pendingOrder.current?.expiresAt);

    return expiresAt !== null && Date.now() >= expiresAt - EXPIRY_LOCK_MS;
  }, []);

  /**
   * 결제창 재료를 받는다 — 살아 있는 주문이 있으면 재시도, 없으면 새 주문.
   * 실패는 그대로 던진다(오류 코드별 처리는 화면이 한다).
   */
  const prepare = useCallback(
    async (request: Omit<CreateOrderRequest, "idempotencyKey">, selection: PaymentSelection) => {
      let response: CreateOrderResponse;

      if (pendingOrder.current) {
        response = await orderService.retryPayment(pendingOrder.current.orderId, selection);
      } else {
        const idempotencyKey = unsentKey.current ?? randomUUID();

        unsentKey.current = idempotencyKey;
        try {
          response = await orderService.create({ ...request, idempotencyKey });
        } catch (error) {
          // 응답이 없거나(네트워크) 결제 사전 등록만 실패(502)면 같은 키로 다시 보내야 한다
          const status = resolveHttpStatus(error);

          if (status !== undefined && status !== 502) {
            unsentKey.current = null;
          }
          throw error;
        }
        unsentKey.current = null;
      }

      pendingOrder.current = { orderId: response.orderId, expiresAt: response.expiresAt };
      await savePending(response.orderId, response.payment.paymentId);

      return response;
    },
    []
  );

  const interpret = useCallback(
    (result: PaymentCompleteResponse, hint: { userClosed: boolean; clientCode: string | null }) => {
      if (result.orderStatus === "PAID" && result.paymentStatus === "PAID") {
        resetPending();
        invalidateOrderQueries({ includeCart: true });
        return { type: "PAID", orderId: result.orderId } as const;
      }
      if (result.orderStatus === "EXPIRED") {
        resetPending();
        return {
          type: "CLOSED",
          message: result.failReason ?? "주문 시간이 만료됐어요. 다시 주문해 주세요.",
        } as const;
      }
      if (result.paymentStatus === "CANCEL_REQUESTED" || result.paymentStatus === "CANCELLED_MISMATCH") {
        resetPending();
        return {
          type: "CLOSED",
          message: `${result.failReason ?? "결제가 자동으로 취소되었어요."} 결제 금액은 자동으로 환불돼요.`,
        } as const;
      }
      if (result.paymentStatus === "FAILED") {
        return { type: "NOT_PAID", message: result.failReason ?? "결제가 완료되지 않았어요." } as const;
      }
      if (result.paymentStatus === "READY" && (hint.userClosed || hint.clientCode)) {
        return { type: "NOT_PAID", message: "결제가 완료되지 않았어요. 다시 시도해 주세요." } as const;
      }
      return null;
    },
    [resetPending]
  );

  /** 결제창이 끝나면(성공·실패·닫음 모두) 부른다 */
  const confirm = useCallback(
    async (paymentId: string, clientResult: PortOneClientResult | undefined, userClosed: boolean) => {
      setPaymentWindow(null);
      setIsBusy(true);
      try {
        for (let attempt = 0; attempt <= READY_POLL_COUNT; attempt++) {
          const result = await orderService.completePayment(paymentId, clientResult);
          const outcome = interpret(result, { userClosed, clientCode: clientResult?.code ?? null });

          if (outcome) {
            onOutcomeRef.current(outcome);
            return;
          }
          // 결제창은 성공으로 끝났는데 아직 READY — 승인 반영이 늦는 경우다. 몇 번 다시 묻는다
          if (attempt < READY_POLL_COUNT) {
            await sleep(READY_POLL_INTERVAL_MS);
          } else {
            onOutcomeRef.current({ type: "PENDING", orderId: result.orderId });
          }
        }
      } catch (error) {
        // 502 PAYMENT_GATEWAY_ERROR — 서버가 포트원 조회에 실패했다. 상태는 그대로이니 상세에서 다시 본다
        const orderId = pendingOrder.current?.orderId;

        if (orderId && resolveErrorCode(error) !== "PAYMENT_NOT_FOUND") {
          onOutcomeRef.current({ type: "PENDING", orderId });
        } else {
          onOutcomeRef.current({
            type: "NOT_PAID",
            message: "결제 결과를 확인하지 못했어요. 다시 시도해 주세요.",
          });
        }
      } finally {
        setIsBusy(false);
      }
    },
    [interpret]
  );

  /**
   * 앱이 다시 앞으로 오면 살아 있는 주문을 다시 읽는다 — 결제창 밖(카드사 앱)에서 결제가 끝나고
   * 웹훅이 먼저 완료시켰을 수 있다. 결제창이 열려 있는 동안은 SDK 콜백을 기다린다.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async state => {
      const orderId = pendingOrder.current?.orderId;

      if (state !== "active" || !orderId || paymentWindow) {
        return;
      }
      try {
        const detail = await orderService.getDetail(orderId);

        if (detail.status === "PAID") {
          resetPending();
          invalidateOrderQueries({ includeCart: true });
          onOutcomeRef.current({ type: "PAID", orderId });
        } else if (detail.status === "EXPIRED" || detail.status === "CANCELLED") {
          resetPending();
        }
      } catch {
        // 다음 탭에서 다시 확인한다
      }
    });

    return () => subscription.remove();
  }, [paymentWindow, resetPending]);

  return {
    paymentWindow,
    openPaymentWindow: setPaymentWindow,
    isBusy,
    setIsBusy,
    prepare,
    confirm,
    resetPending,
    isPendingExpiring,
    hasPendingOrder: () => !!pendingOrder.current,
    getPendingOrderId: () => pendingOrder.current?.orderId,
  };
}
