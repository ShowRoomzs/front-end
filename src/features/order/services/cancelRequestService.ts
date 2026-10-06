import { orderService } from "@/features/order/services/orderService";
import {
  CancelRequestDetail,
  CancelRequestStatus,
  CreateCancelRequest,
} from "@/features/order/types/cancelRequest";
import { OrderItemRow } from "@/features/order/types/order";

/**
 * 소비자 취소 요청(C10 1c) · 취소 상세(C10 1d) — **앱용 API가 아직 없다.**
 *
 * 화면은 시안대로 전부 만들고, 데이터는 **DEV 빌드에서만** 이 파일의 목업이 채운다. 배포본에서는
 * `isAvailable`이 거짓이라 진입점이 「준비 중」 안내로 막힌다 — 배포본에 가짜 요청·환불 금액이
 * 보이면 실제 소비자가 취소된 줄 안다. API가 생기면 이 파일의 함수만 실제 호출로 바꾼다.
 *
 * 서버에 필요한 것(백엔드 요청): 취소 요청 생성(항목·수량·사유) · 상세 조회 · 철회 API와,
 * 주문 내역 항목에 `CANCEL_REQUEST` · `CANCEL_DETAIL` 버튼을 켜는 것(서버 C10 설계서 1-6 · 7-2 C1~C7).
 */
export const CANCEL_REQUEST_AVAILABLE = __DEV__;

export const CANCEL_REQUEST_NOT_READY_MESSAGE =
  "상품 준비가 시작된 주문의 취소 요청은 준비 중이에요. 1:1 문의로 접수해 주세요.";

/** DEV 목업 저장소 — 앱을 다시 켜면 비워진다 */
const mockRequests = new Map<number, CancelRequestDetail>();

let mockSeq = 9000;

function nowKst() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);

  return now.toISOString().slice(0, 19);
}

function assertAvailable() {
  if (!CANCEL_REQUEST_AVAILABLE) {
    throw new Error(CANCEL_REQUEST_NOT_READY_MESSAGE);
  }
}

export const cancelRequestService = {
  create: async (body: CreateCancelRequest) => {
    assertAvailable();
    const order = await orderService.getDetail(body.orderId);
    const rows = order.items.filter(item =>
      body.items.some(target => target.orderProductId === item.orderProductId)
    );
    const items = rows.map(row => {
      const quantity = body.items.find(target => target.orderProductId === row.orderProductId)?.quantity ?? 1;

      return {
        orderProductId: row.orderProductId,
        productId: row.productId,
        brandName: row.brandName ?? "",
        productName: row.productName,
        optionName: row.optionName,
        quantity,
        amount: Math.round((row.amount / Math.max(1, row.quantity)) * quantity),
        thumbnailUrl: row.thumbnailUrl,
      };
    });
    const amount = items.reduce((sum, item) => sum + item.amount, 0);
    const cancelRequestId = ++mockSeq;

    mockRequests.set(cancelRequestId, {
      cancelRequestId,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      status: "PENDING",
      requestedAt: nowKst(),
      decidedAt: null,
      reason: body.reason,
      reasonDetail: body.reasonDetail ?? null,
      rejectReason: null,
      rejectMessage: null,
      items,
      paidAmount: amount,
      refundAmount: amount,
      refundMethodLabel: order.payment?.methodLabel ?? "",
    });

    return { cancelRequestId };
  },

  getDetail: async (cancelRequestId: number) => {
    assertAvailable();
    const found = mockRequests.get(cancelRequestId);

    if (!found) {
      throw new Error("취소 요청을 찾지 못했어요.");
    }
    return found;
  },

  withdraw: async (cancelRequestId: number) => {
    assertAvailable();
    mockRequests.delete(cancelRequestId);
  },

  /** DEV에서 세 상태(확인 중 · 승인 · 반려)를 눈으로 확인하는 스위치 — 시안의 [상태] 전환과 같은 역할 */
  devSetStatus: (cancelRequestId: number, status: CancelRequestStatus) => {
    const found = mockRequests.get(cancelRequestId);

    if (!found || !CANCEL_REQUEST_AVAILABLE) {
      return;
    }
    mockRequests.set(cancelRequestId, {
      ...found,
      status,
      decidedAt: status === "PENDING" ? null : nowKst(),
      rejectReason: status === "REJECTED" ? "ALREADY_PACKED" : null,
      rejectMessage:
        status === "REJECTED"
          ? "요청하신 시점에 이미 포장을 마친 상태예요. 받으신 뒤 반품을 신청해 주세요."
          : null,
      refundAmount: status === "REJECTED" ? 0 : found.paidAmount,
    });
  },
};

/**
 * DEV에서만 — 서버가 아직 켜지 않은 [취소 요청] 버튼을 상품준비중 항목에 붙여 진입점을 만든다.
 * 배포본에서는 서버가 내린 버튼 그대로다.
 */
export function withDevCancelRequestActions(row: OrderItemRow): OrderItemRow {
  if (!CANCEL_REQUEST_AVAILABLE || row.status !== "PREPARING") {
    return row;
  }
  if (row.actions.some(action => action.type === "CANCEL_REQUEST")) {
    return row;
  }
  return { ...row, actions: [...row.actions, { type: "CANCEL_REQUEST", label: "취소 요청", enabled: true }] };
}
