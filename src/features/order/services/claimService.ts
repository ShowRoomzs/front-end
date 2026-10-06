import { apiInstance } from "@/common/lib/apiInstance";
import {
  ClaimDetailResponse,
  ClaimFormResponse,
  ClaimInvoiceRequest,
  ClaimPaymentCompleteResponse,
  ClaimType,
  CollectionTrackingResponse,
  CreateClaimRequest,
  CreateClaimResponse,
  ReshipFeePaymentRequest,
  WithdrawClaimResponse,
} from "@/features/order/types/claim";
import { TrackingResponse } from "@/features/order/types/order";
import { PaymentWindow } from "@/features/order/types/payment";

/**
 * 반품·교환 API(`User - Claim`).
 *
 * 남의 클레임은 404 `CLAIM_NOT_FOUND`로 온다(존재 비노출). 상세 · 송장 등록 · 배송지 변경은
 * 모두 **갱신된 상세**를 돌려주므로 그 값으로 캐시를 바로 덮는다.
 */
export const claimService = {
  /** C10-3 진입 — 진입 항목이 든 하위주문의 신청 가능 항목 전부 */
  getForm: async (orderProductId: number, type: ClaimType) => {
    const { data } = await apiInstance.get<ClaimFormResponse>("/user/claims/form", {
      params: { orderProductId, type },
    });

    return data;
  },

  /** payment가 오면 결제창 → 확정이 끝나야 접수된다 */
  create: async (body: CreateClaimRequest) => {
    const { data } = await apiInstance.post<CreateClaimResponse>("/user/claims", body);

    return data;
  },

  getDetail: async (claimId: number) => {
    const { data } = await apiInstance.get<ClaimDetailResponse>(`/user/claims/${claimId}`);

    return data;
  },

  /** 등록·수정 겸용 — 요청(박스) 단위로 적용된다 */
  putCollectionInvoice: async (claimId: number, body: ClaimInvoiceRequest) => {
    const { data } = await apiInstance.put<ClaimDetailResponse>(
      `/user/claims/${claimId}/collection-invoice`,
      body
    );

    return data;
  },

  /** 송장을 넣기 전까지만 — 이미 보냈으면 409 */
  withdraw: async (claimId: number) => {
    const { data } = await apiInstance.post<WithdrawClaimResponse>(`/user/claims/${claimId}/withdraw`);

    return data;
  },

  changeReshipAddress: async (claimId: number, addressId: number) => {
    const { data } = await apiInstance.patch<ClaimDetailResponse>(`/user/claims/${claimId}/reship-address`, {
      addressId,
    });

    return data;
  },

  /** 반려 상품 재발송비 — 결제수단을 감싸지 않고 **평평하게** 보낸다(교환 요청과 다르다) */
  payReshipFee: async (claimId: number, body: ReshipFeePaymentRequest) => {
    const { data } = await apiInstance.post<PaymentWindow>(
      `/user/claims/${claimId}/reship-fee/payments`,
      body
    );

    return data;
  },

  /** `clm-` 결제의 확정 — 주문 결제 확정 API로 보내면 404다 */
  completePayment: async (paymentId: string) => {
    const { data } = await apiInstance.post<ClaimPaymentCompleteResponse>(
      `/user/claims/payments/${encodeURIComponent(paymentId)}/complete`
    );

    return data;
  },

  getCollectionTracking: async (claimId: number) => {
    const { data } = await apiInstance.get<CollectionTrackingResponse>(
      `/user/claims/${claimId}/collection-tracking`
    );

    return data;
  },

  /** 교환 새 상품 · 반려 상품 재발송 — C10-2와 같은 응답 모양 */
  getReshipTracking: async (claimId: number) => {
    const { data } = await apiInstance.get<TrackingResponse>(`/user/claims/${claimId}/reship-tracking`);

    return data;
  },
};
