import { CommonActions } from "@react-navigation/native";
import { useEffect } from "react";

import { navigationRef } from "@/common/router/navigationRef";
import {
  COMMON_ROUTES,
  COUPON_ROUTES,
  MYPAGE_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";

/**
 * 로그인해야 쓰는 화면 — 앱 안에서는 버튼이 먼저 로그인을 묻기 때문에(usePermissionPress) 로그아웃 상태로
 * 이 화면에 닿는 길이 없다. 주소(웹 주소창 · 링크 · 새로고침 · 앱 딥링크)로는 바로 닿을 수 있어, 그때 빈 화면이 된다.
 * 장바구니 · 알림은 앱에서도 로그아웃 상태로 열리는 화면이라 넣지 않는다(앱과 같게).
 */
const LOGIN_ONLY_ROUTES = new Set<string>([
  COMMON_ROUTES.WISHLIST,
  COMMON_ROUTES.ORDER_DETAIL,
  COMMON_ROUTES.CLAIM_DETAIL,
  MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH,
  MYPAGE_ROUTES.ADDRESS_MANAGEMENT,
  MYPAGE_ROUTES.INQUIRY_HISTORY,
  MYPAGE_ROUTES.INQUIRY_DETAIL,
  COUPON_ROUTES.LIST,
  COUPON_ROUTES.REGISTER,
  ...Object.values(SETTINGS_ROUTES),
]);

const NAVIGATION_WAIT_MS = 5000;
const POLL_MS = 100;

interface LoginRequiredHostProps {
  /** 저장된 세션을 다 읽었는지(useInit) — 그 전에는 로그인한 사람도 잠깐 로그아웃 상태로 보인다 */
  isReady: boolean;
}

/**
 * 로그아웃 상태로 로그인 전용 화면 주소에 들어오면 홈을 깔고 로그인 창을 띄운다.
 * 로그인하면 원래 들어오려던 화면으로 되돌리고, 닫으면 홈에 남는다.
 *
 * 처음 열릴 때 한 번만 본다 — 앱 안에서의 이동은 버튼이 이미 로그인을 묻는다.
 */
export default function LoginRequiredHost(props: LoginRequiredHostProps) {
  const { isReady } = props;

  useEffect(() => {
    if (!isReady) {
      return;
    }
    let waited = 0;
    const timer = setInterval(() => {
      waited += POLL_MS;
      if (!navigationRef.isReady()) {
        if (waited >= NAVIGATION_WAIT_MS) {
          clearInterval(timer);
        }
        return;
      }
      clearInterval(timer);

      const route = navigationRef.getCurrentRoute();

      if (useUserStore.getState().user || !route || !LOGIN_ONLY_ROUTES.has(route.name)) {
        return;
      }
      const requestedState = navigationRef.getRootState();

      navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: ROOT_ROUTES.HOME }] }));
      navigationRef.dispatch(
        CommonActions.navigate(ROOT_ROUTES.AUTH, {
          params: { onSuccessLogin: () => navigationRef.dispatch(CommonActions.reset(requestedState)) },
        })
      );
    }, POLL_MS);

    return () => clearInterval(timer);
  }, [isReady]);

  return null;
}
