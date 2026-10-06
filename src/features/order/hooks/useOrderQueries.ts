import { useQuery } from "@tanstack/react-query";

import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { queryClient } from "@/common/lib/queryClient";
import { PageResponse } from "@/common/types/page";
import { CART_QUERY_KEY } from "@/features/cart/constants/queryKey";
import { ORDER_QUERY_KEY } from "@/features/order/constants/queryKey";
import { withDevCancelRequestActions } from "@/features/order/services/cancelRequestService";
import { claimService } from "@/features/order/services/claimService";
import { orderService } from "@/features/order/services/orderService";
import { ClaimType } from "@/features/order/types/claim";
import { CheckoutRequest, OrderCard } from "@/features/order/types/order";

/**
 * 주문·반품·교환 조회 훅.
 *
 * 상태가 서버에서 자주 바뀌는 화면이라(웹훅이 결제를 완료하고, 브랜드가 준비를 시작하고, 배치가
 * 송장 미등록 요청을 닫는다) 캐시를 길게 두지 않는다 — 화면에 들어올 때마다 다시 읽는다.
 */

/** C9 주문서 — 배송지를 바꿀 때마다 금액(배송비)이 다시 계산되므로 요청 전체를 키로 쓴다 */
export function useGetCheckout(request: CheckoutRequest | null) {
  return useQuery({
    queryKey: [ORDER_QUERY_KEY.CHECKOUT, request],
    queryFn: () => orderService.checkout(request as CheckoutRequest),
    enabled: !!request,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

/**
 * C10 주문 내역.
 *
 * 서버의 페이지 응답은 앱 공통 `PageResponse`와 `pageInfo` 키가 다르다(`totalResults` · `limit`).
 * 무한 스크롤이 읽는 `currentPage` · `hasNext`는 둘 다 있으므로 경계에서 모양만 맞춘다.
 */
export function useGetOrderList(enabled = true) {
  return useInfiniteList<OrderCard>({
    queryKey: [ORDER_QUERY_KEY.ORDER_LIST],
    queryFn: async page => {
      const response = await orderService.getList(page);

      return {
        content: response.content.map(card => ({
          ...card,
          items: card.items.map(withDevCancelRequestActions),
        })),
        pageInfo: {
          currentPage: response.pageInfo.currentPage,
          hasNext: response.pageInfo.hasNext,
          isLast: !response.pageInfo.hasNext,
          pageSize: response.pageInfo.limit,
          totalElements: response.pageInfo.totalResults,
          totalPages: response.pageInfo.totalPages,
        },
      } satisfies PageResponse<OrderCard>;
    },
    enabled,
    staleTime: 0,
  });
}

export function useGetOrderDetail(orderId: number | undefined) {
  return useQuery({
    queryKey: [ORDER_QUERY_KEY.ORDER_DETAIL, orderId],
    queryFn: async () => {
      const detail = await orderService.getDetail(orderId as number);

      return { ...detail, items: detail.items.map(withDevCancelRequestActions) };
    },
    enabled: !!orderId,
    staleTime: 0,
  });
}

/** C10-2 — 주문 항목의 송장이거나(`orderProductId`) 재발송 송장(`reshipClaimId`) */
export function useGetTracking(params: {
  orderId?: number;
  orderProductId?: number;
  reshipClaimId?: number;
}) {
  const { orderId, orderProductId, reshipClaimId } = params;

  return useQuery({
    queryKey: reshipClaimId
      ? [ORDER_QUERY_KEY.RESHIP_TRACKING, reshipClaimId]
      : [ORDER_QUERY_KEY.ITEM_TRACKING, orderId, orderProductId],
    queryFn: () =>
      reshipClaimId
        ? claimService.getReshipTracking(reshipClaimId)
        : orderService.getItemTracking(orderId as number, orderProductId as number),
    enabled: !!reshipClaimId || (!!orderId && !!orderProductId),
    staleTime: 0,
  });
}

export function useGetClaimForm(orderProductId: number, type: ClaimType) {
  return useQuery({
    queryKey: [ORDER_QUERY_KEY.CLAIM_FORM, orderProductId, type],
    queryFn: () => claimService.getForm(orderProductId, type),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

export function useGetClaimDetail(claimId: number | undefined) {
  return useQuery({
    queryKey: [ORDER_QUERY_KEY.CLAIM_DETAIL, claimId],
    queryFn: () => claimService.getDetail(claimId as number),
    enabled: !!claimId,
    staleTime: 0,
  });
}

export function useGetCollectionTracking(claimId: number) {
  return useQuery({
    queryKey: [ORDER_QUERY_KEY.COLLECTION_TRACKING, claimId],
    queryFn: () => claimService.getCollectionTracking(claimId),
    staleTime: 0,
  });
}

/**
 * 주문 상태가 바뀌는 일(결제 · 취소 · 배송지 변경 · 반품·교환 요청·철회)이 끝나면 부른다.
 *
 * 한 사건이 목록 · 상세 · 클레임 상세에 동시에 비치므로 하나만 갱신하면 화면끼리 말이 어긋난다.
 * 결제가 끝나면 서버가 결제된 장바구니 항목을 지우므로 장바구니도 함께 다시 읽는다.
 */
export function invalidateOrderQueries(options?: { includeCart?: boolean }) {
  queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.ORDER_LIST] });
  queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.ORDER_DETAIL] });
  queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.CLAIM_DETAIL] });
  queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.COLLECTION_TRACKING] });

  if (options?.includeCart) {
    queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY.CART] });
  }
}
