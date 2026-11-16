import { CommonActions } from "@react-navigation/native";

import { navigationRef } from "@/common/router/navigationRef";
import { COMMON_ROUTES, HOME_ROUTES, MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { NotificationItem } from "@/features/notification/types/notification";

type Target = NotificationItem["target"];

/**
 * 전역 ref의 navigate는 지금 열린 화면 쪽 내비게이터부터 처리한다 — 하단 탭에도 「home」 탭이 있어 그 탭이
 * 가로챌 수 있다. 루트 스택을 대상으로 못 박는다(AccountStatusHost와 같은 방식)
 */
function navigateFromRoot(name: string, params: object) {
  navigationRef.dispatch({
    ...CommonActions.navigate(name, params),
    target: navigationRef.getRootState().key,
  });
}

function openCommon(screen: string, params: object) {
  navigateFromRoot(ROOT_ROUTES.COMMON, { screen, params });
}

function openMypage(screen: string, params?: object) {
  navigateFromRoot(ROOT_ROUTES.HOME, { screen: HOME_ROUTES.MYPAGE, params: { screen, params } });
}

function go(navigate: () => void) {
  navigate();
  return true;
}

/**
 * 알림 대상 화면으로 — C11 알림 목록을 누를 때와 푸시를 눌러 앱이 열릴 때 같은 규칙으로 간다.
 * 계정 상태(`ACCOUNT_STATUS`)는 시트라 여기서 다루지 않는다(부르는 쪽이 연다).
 *
 * @returns 이동했으면 true — 갈 곳이 없거나 앱이 아직 모르는 대상이면 false
 */
export function openNotificationTarget({ type, id, sub, orderId }: Target) {
  if (!navigationRef.isReady()) {
    return false;
  }
  switch (type) {
    case "CLAIM":
      return !!id && go(() => openCommon(COMMON_ROUTES.CLAIM_DETAIL, { claimId: id }));
    case "POST":
      return !!id && go(() => openCommon(COMMON_ROUTES.POST_DETAIL, { postId: id }));
    // 쇼룸 대상 id는 크리에이터 id다 — 쇼룸 상세 경로가 같은 id를 쓴다
    case "SHOWROOM":
      return !!id && go(() => openCommon(COMMON_ROUTES.SHOWROOM_DETAIL, { showroomId: id }));
    case "PRODUCT":
      return !!id && go(() => openCommon(COMMON_ROUTES.PRODUCT_DETAIL, { productId: id }));
    case "INQUIRY":
      if (sub === "PRODUCT") {
        openMypage(MYPAGE_ROUTES.INQUIRY_HISTORY);
        return true;
      }
      return !!id && go(() => openMypage(MYPAGE_ROUTES.INQUIRY_DETAIL, { inquiryId: id }));
    // `id`는 하위주문(배송 그룹) id라 주문 상세는 `orderId`로 연다 — 없으면(옛 알림 · 푸시) 주문 내역으로
    case "ORDER_GROUP":
      if (orderId) {
        openCommon(COMMON_ROUTES.ORDER_DETAIL, { orderId });
      } else {
        openMypage(MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH);
      }
      return true;
    case "SETTINGS":
      openMypage(MYPAGE_ROUTES.SETTINGS);
      return true;
    default:
      return false;
  }
}
