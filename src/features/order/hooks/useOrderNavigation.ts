import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";

import { toast } from "@/common/providers/ToastProvider";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  CANCEL_REQUEST_AVAILABLE,
  CANCEL_REQUEST_NOT_READY_MESSAGE,
} from "@/features/order/services/cancelRequestService";
import { OrderItemAction, OrderItemRow } from "@/features/order/types/order";

type CommonScreen = keyof CommonStackParamList;

/**
 * 주문 화면 사이의 이동.
 *
 * 주문 내역(C10)은 마이 스택에, 그 뒤의 화면(주문 상세 · 배송 조회 · 반품·교환)은 어디서든 여는
 * 공용 스택에 있다. 지금 스택에 그 화면이 있으면 **push**하고(같은 화면을 다른 대상으로 겹쳐 열
 * 수 있어야 한다 — 반품 상세에서 다른 항목의 반품 상세로), 없으면 공용 스택으로 건너간다.
 */
export function useOrderNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<CommonStackParamList>>();
  const mainNavigation = useMainNavigation();

  const open = useCallback(
    <S extends CommonScreen>(screen: S, params: CommonStackParamList[S]) => {
      const state = navigation.getState();
      const routeNames = state?.routeNames as Array<string> | undefined;
      // 같은 대상의 화면이 이미 쌓여 있으면 새로 겹치지 않고 그 화면으로 돌아간다(배송 조회 → [주문 상세])
      const existing = state?.routes.find(
        route => route.name === screen && JSON.stringify(route.params ?? {}) === JSON.stringify(params ?? {})
      );

      if (existing) {
        (navigation.popTo as (name: S, params: CommonStackParamList[S]) => void)(screen, params);
        return;
      }
      if (routeNames?.includes(screen)) {
        (navigation.push as (name: S, params: CommonStackParamList[S]) => void)(screen, params);
        return;
      }
      mainNavigation.navigate(ROOT_ROUTES.COMMON, { screen, params } as never);
    },
    [mainNavigation, navigation]
  );

  /** 취소 상세(C10 1d) — 항목 기준(요청 · 직접 취소 · 직권 취소 모두) */
  const openCancelDetail = useCallback(
    (orderId: number, orderProductId: number) => {
      open(COMMON_ROUTES.CANCEL_DETAIL, { orderId, orderProductId });
    },
    [open]
  );

  /**
   * 항목 버튼 — 서버가 내린 것만 그린다. 갈 곳은 버튼 종류가 정한다.
   * 취소 요청은 서버가 하위주문 id를 아직 내리지 않아 DEV 목업으로만 접수된다(`cancelRequestService`).
   */
  const handleItemAction = useCallback(
    (orderId: number, item: OrderItemRow, action: OrderItemAction) => {
      if (!action.enabled) {
        return;
      }
      switch (action.type) {
        case "CANCEL":
          open(COMMON_ROUTES.ORDER_CANCEL, { orderId });
          return;
        case "TRACK_DELIVERY":
          open(COMMON_ROUTES.DELIVERY_TRACKING, { orderId, orderProductId: item.orderProductId });
          return;
        case "RETURN_EXCHANGE":
          open(COMMON_ROUTES.ORDER_DETAIL, { orderId });
          return;
        case "RETURN_REQUEST":
          open(COMMON_ROUTES.CLAIM_REQUEST, { orderProductId: item.orderProductId, type: "RETURN" });
          return;
        case "EXCHANGE_REQUEST":
          open(COMMON_ROUTES.CLAIM_REQUEST, { orderProductId: item.orderProductId, type: "EXCHANGE" });
          return;
        case "CLAIM_DETAIL":
          if (item.claim) {
            open(COMMON_ROUTES.CLAIM_DETAIL, { claimId: item.claim.claimId });
          }
          return;
        case "CANCEL_REQUEST":
          if (!CANCEL_REQUEST_AVAILABLE) {
            toast.show(CANCEL_REQUEST_NOT_READY_MESSAGE);
            return;
          }
          open(COMMON_ROUTES.CANCEL_REQUEST, { orderId, orderProductId: item.orderProductId });
          return;
        case "CANCEL_DETAIL":
          openCancelDetail(orderId, item.orderProductId);
      }
    },
    [open, openCancelDetail]
  );

  return { open, handleItemAction, openCancelDetail };
}
