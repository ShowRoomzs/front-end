import { useCallback } from "react";

import { useMainNavigation } from "../router";
import { ROOT_ROUTES } from "../router/routes";
import { useUserStore } from "../stores/useUserStore";

export function usePermissionPress(callback: () => void | Promise<void>) {
  const { user } = useUserStore();
  const navigation = useMainNavigation();
  const handlePress = useCallback(async () => {
    if (!user) {
      // TODO : 권한 팝업 표출 후 로그인 화면으로 라우팅
      navigation.navigate(ROOT_ROUTES.AUTH);
      return;
    }
    await callback();
  }, [callback, navigation, user]);

  return handlePress;
}
