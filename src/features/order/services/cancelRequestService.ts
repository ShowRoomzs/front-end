import { apiInstance } from "@/common/lib/apiInstance";
import { orderService } from "@/features/order/services/orderService";
import {
  CANCEL_REQUEST_REASONS,
  CancelDetail,
  CancelPhase,
  CancelRequestReason,
  CreateCancelRequestBody,
} from "@/features/order/types/cancelRequest";
import { OrderItemRow } from "@/features/order/types/order";

/**
 * 소비자 취소 요청(C10 1c) · 취소 상세(C10 1d) — back-end `OrderController` 취소 API.
 *
 * - **취소 상세**는 실제 API다(항목 기준). 요청 · 직접 취소 · 직권 취소가 모두 같은 응답으로 온다.
 * - **취소 요청 생성**은 서버가 `deliveryGroupId`(하위주문)를 받는데 주문 응답이 아직 이 값을 내리지 않는다
 *   (`OrderItemRow.deliveryGroupId`). 값이 있으면 실제 API로 보내고, 없으면 DEV 빌드에서만 목업으로 접수한다.
 *   배포본은 진입점이 「준비 중」 안내로 막힌다 — 가짜 요청이 접수된 것처럼 보이면 실제 소비자가 취소된 줄 안다.
 * - 요청 철회 API는 서버에 없다 — 철회는 DEV 목업 요청에서만 된다.
 */
export const CANCEL_REQUEST_AVAILABLE = __DEV__;

export const CANCEL_REQUEST_NOT_READY_MESSAGE =
  "상품 준비가 시작된 주문의 취소 요청은 준비 중이에요. 1:1 문의로 접수해 주세요.";

/** DEV 목업 저장소 — 앱을 다시 켜면 비워진다 */
const mockRequests = new Map<number, CancelDetail>();

let mockSeq = 9000;

function nowKst() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);

  return now.toISOString().slice(0, 19);
}

export interface CreateCancelRequestInput {
  orderId: number;
  items: Array<{ orderProductId: number; quantity: number }>;
  reason: CancelRequestReason;
  reasonDetail?: string;
  /** 선택한 항목의 하위주문 — 모두 같아야 한다. 없으면(서버 미제공) DEV 목업으로 접수한다 */
  deliveryGroupId: number | null;
}

export type CreateCancelRequestResult =
  | { source: "SERVER"; detail: CancelDetail }
  | { source: "DEV_MOCK"; mockRequestId: number };

export const cancelRequestService = {
  getDetail: async (orderId: number, orderProductId: number) => {
    const { data } = await apiInstance.get<CancelDetail>(
      `/user/orders/${orderId}/items/${orderProductId}/cancel`
    );

    return data;
  },

  create: async (input: CreateCancelRequestInput): Promise<CreateCancelRequestResult> => {
    if (input.deliveryGroupId) {
      const body: CreateCancelRequestBody = {
        deliveryGroupId: input.deliveryGroupId,
        orderProductIds: input.items.map(item => item.orderProductId),
        reasonCode: input.reason,
        reasonDetail: input.reasonDetail,
      };
      const { data } = await apiInstance.post<CancelDetail>(
        `/user/orders/${input.orderId}/cancel-requests`,
        body
      );

      return { source: "SERVER", detail: data };
    }
    if (!CANCEL_REQUEST_AVAILABLE) {
      throw new Error(CANCEL_REQUEST_NOT_READY_MESSAGE);
    }
    return { source: "DEV_MOCK", mockRequestId: await createMock(input) };
  },

  /** DEV 목업 요청만 — 서버 요청은 상세 API로 본다 */
  getMockDetail: async (mockRequestId: number) => {
    const found = mockRequests.get(mockRequestId);

    if (!found) {
      throw new Error("취소 요청을 찾지 못했어요.");
    }
    return found;
  },

  withdrawMock: async (mockRequestId: number) => {
    mockRequests.delete(mockRequestId);
  },

  /** DEV에서 세 상태(확인 중 · 취소 완료 · 거부)를 눈으로 확인하는 스위치 — 시안의 [상태] 전환과 같은 역할 */
  devSetPhase: (mockRequestId: number, phase: CancelPhase) => {
    const found = mockRequests.get(mockRequestId);

    if (!found || !CANCEL_REQUEST_AVAILABLE) {
      return;
    }
    const amount = found.items.reduce((sum, item) => sum + item.amount, 0);

    mockRequests.set(mockRequestId, {
      ...found,
      phase,
      phaseLabel: MOCK_PHASE_LABEL[phase],
      notices: MOCK_NOTICES[phase],
      respondDueAt: phase === "REVIEWING" ? found.respondDueAt : null,
      decidedAt: phase === "REVIEWING" ? null : nowKst(),
      rejection:
        phase === "REJECTED"
          ? {
              reasonLabel: "이미 포장·출고가 완료됨",
              detail: "요청하신 시점에 이미 포장을 마친 상태예요. 받으신 뒤 반품을 신청해 주세요.",
            }
          : null,
      refund:
        phase === "CANCELLED"
          ? {
              amount,
              status: "DONE",
              statusLabel: "환불 완료",
              methodLabel: null,
              refundedAt: nowKst(),
            }
          : null,
    });
  },
};

/** 목업 문구는 서버(`UserCancelService`)와 같게 둔다 */
const MOCK_PHASE_LABEL: Record<CancelPhase, string> = {
  REVIEWING: "확인 중",
  REJECTED: "취소 요청 거부",
  CANCELLED: "취소 완료",
};

const MOCK_NOTICES: Record<CancelPhase, Array<string>> = {
  REVIEWING: [
    "브랜드가 1영업일(주말·공휴일 제외) 안에 확인하지 않으면 자동으로 취소돼요",
    "취소 요청이 처리될 때까지 이 주문의 상품은 발송되지 않아요",
  ],
  REJECTED: ["브랜드가 취소 요청을 거부해 상품이 발송돼요. 받은 뒤 반품을 신청할 수 있어요"],
  CANCELLED: [],
};

async function createMock(input: CreateCancelRequestInput) {
  const order = await orderService.getDetail(input.orderId);
  const items = order.items
    .filter(row => input.items.some(target => target.orderProductId === row.orderProductId))
    .map(row => {
      const quantity =
        input.items.find(target => target.orderProductId === row.orderProductId)?.quantity ?? 1;

      return {
        orderProductId: row.orderProductId,
        productName: row.productName,
        optionName: row.optionName,
        thumbnailUrl: row.thumbnailUrl,
        quantity,
        amount: Math.round((row.amount / Math.max(1, row.quantity)) * quantity),
      };
    });
  const mockRequestId = ++mockSeq;

  mockRequests.set(mockRequestId, {
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    cancelRequestId: mockRequestId,
    kind: "REQUEST",
    phase: "REVIEWING",
    phaseLabel: MOCK_PHASE_LABEL.REVIEWING,
    autoApproved: false,
    notices: MOCK_NOTICES.REVIEWING,
    requestedAt: nowKst(),
    respondDueAt: null,
    decidedAt: null,
    reasonLabel: CANCEL_REQUEST_REASONS.find(item => item.code === input.reason)?.text ?? "",
    reasonDetail: input.reasonDetail ?? null,
    rejection: null,
    items,
    refund: null,
  });
  return mockRequestId;
}

/**
 * DEV에서만 — 서버가 [취소 요청] 버튼을 내리지 않는 상품준비중 항목에 붙여 진입점을 만든다.
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
