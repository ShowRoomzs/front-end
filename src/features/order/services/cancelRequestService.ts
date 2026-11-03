import { apiInstance } from "@/common/lib/apiInstance";
import {
  CancelDetail,
  CancelRequestReason,
  CancelWithdrawResponse,
  CreateCancelRequestBody,
} from "@/features/order/types/cancelRequest";

/**
 * 소비자 취소 요청(C10 1c) · 취소 상세(C10 1d) — back-end `OrderController` 취소 API.
 *
 * - **취소 상세**는 실제 API다(항목 기준). 요청 · 직접 취소 · 직권 취소가 모두 같은 응답으로 온다.
 * - **취소 요청 생성**은 한 하위주문(`items[].deliveryGroupId`)의 항목을 **전량**으로 받는다 — 부분 수량은 없다.
 * - 철회는 요청 단위다(요청에 담긴 항목이 함께 철회된다). 상세의 `withdrawable`이 참일 때만 연다.
 */

export interface CreateCancelRequestInput {
  orderId: number;
  /** 고른 항목의 하위주문 — 한 요청에 하나다 */
  deliveryGroupId: number;
  orderProductIds: Array<number>;
  reason: CancelRequestReason;
  reasonDetail?: string;
}

export const cancelRequestService = {
  getDetail: async (orderId: number, orderProductId: number) => {
    const { data } = await apiInstance.get<CancelDetail>(
      `/user/orders/${orderId}/items/${orderProductId}/cancel`
    );

    return data;
  },

  create: async (input: CreateCancelRequestInput) => {
    const body: CreateCancelRequestBody = {
      deliveryGroupId: input.deliveryGroupId,
      orderProductIds: input.orderProductIds,
      reasonCode: input.reason,
      reasonDetail: input.reasonDetail,
    };
    const { data } = await apiInstance.post<CancelDetail>(
      `/user/orders/${input.orderId}/cancel-requests`,
      body
    );

    return data;
  },

  /** 409 `CANCEL_REQUEST_ALREADY_DECIDED` — 그사이 브랜드가 승인 · 거부했거나 자동 승인됐다 */
  withdraw: async (orderId: number, cancelRequestId: number) => {
    const { data } = await apiInstance.post<CancelWithdrawResponse>(
      `/user/orders/${orderId}/cancel-requests/${cancelRequestId}/withdraw`
    );

    return data;
  },
};
