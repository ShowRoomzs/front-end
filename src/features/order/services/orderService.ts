import { apiInstance } from "@/common/lib/apiInstance";
import {
  CancelOrderResponse,
  CheckoutRequest,
  CheckoutResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  MaskedAddress,
  OrderDetailResponse,
  OrderListResponse,
  PaymentCompleteResponse,
  TrackingResponse,
} from "@/features/order/types/order";
import { PaymentSelection, PortOneClientResult } from "@/features/order/types/payment";

/**
 * 주문 · 결제 API(`User - Order` · `User - Payment`).
 *
 * 금액은 앱이 만들지 않는다 — 화면 금액은 주문서 `summary`, 결제 금액은 주문 생성 응답의
 * `payment.totalAmount`다. 여기서도 합계를 다시 계산하지 않는다.
 */
export const orderService = {
  /** C9 진입 — 저장하지 않는다. 장바구니 진입과 바로 구매 중 하나만 보낸다 */
  checkout: async (body: CheckoutRequest) => {
    const { data } = await apiInstance.post<CheckoutResponse>("/user/orders/checkout", body);

    return data;
  },

  /** 주문 생성 — 이 순간 재고가 30분 잡힌다. 「결제하기」 탭 한 번에 한 번만 부른다 */
  create: async (body: CreateOrderRequest) => {
    const { data } = await apiInstance.post<CreateOrderResponse>("/user/orders", body);

    return data;
  },

  /** 실패·창 닫음 뒤 같은 주문으로 다시 결제 — 새 paymentId가 나온다 */
  retryPayment: async (orderId: number, payment: PaymentSelection) => {
    const { data } = await apiInstance.post<CreateOrderResponse>(`/user/orders/${orderId}/payments`, {
      payment,
    });

    return data;
  },

  /** 결제창이 끝나면 결과와 관계없이 부른다 — 서버가 포트원을 다시 조회해 판정한다 */
  completePayment: async (paymentId: string, clientResult?: PortOneClientResult) => {
    const { data } = await apiInstance.post<PaymentCompleteResponse>(
      `/user/payments/${encodeURIComponent(paymentId)}/complete`,
      clientResult ? { clientResult } : {}
    );

    return data;
  },

  /** C10 주문 내역 — 최근 6개월 · 결제된 적 있는 주문만. 페이지 단위는 주문이다 */
  getList: async (page: number, size = 20) => {
    const { data } = await apiInstance.get<OrderListResponse>("/user/orders", { params: { page, size } });

    return data;
  },

  getDetail: async (orderId: number) => {
    const { data } = await apiInstance.get<OrderDetailResponse>(`/user/orders/${orderId}`);

    return data;
  },

  /** 전액 취소만 된다. 202면 PG 응답 지연 — 실패가 아니라 「취소 처리 중」이다 */
  cancel: async (orderId: number, reason?: string) => {
    const response = await apiInstance.post<CancelOrderResponse>(`/user/orders/${orderId}/cancel`, {
      reason,
    });

    return { ...response.data, isPending: response.status === 202 };
  },

  /** C10-1 [배송지 변경] — 결제완료이고 브랜드가 준비를 시작하기 전까지만 */
  changeDeliveryAddress: async (orderId: number, addressId: number) => {
    const { data } = await apiInstance.patch<{ maskedAddress: MaskedAddress }>(
      `/user/orders/${orderId}/delivery-address`,
      { addressId }
    );

    return data;
  },

  /** C10-2 배송 조회 — 그 항목이 든 하위주문의 송장 */
  getItemTracking: async (orderId: number, orderProductId: number) => {
    const { data } = await apiInstance.get<TrackingResponse>(
      `/user/orders/${orderId}/items/${orderProductId}/tracking`
    );

    return data;
  },
};
