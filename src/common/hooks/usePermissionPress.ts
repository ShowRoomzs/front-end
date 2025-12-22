import { useCallback } from "react";

import { useMainNavigation } from "../router";
import { ROOT_ROUTES } from "../router/routes";
import { useUserStore } from "../stores/useUserStore";

export function usePermissionPress(callback: () => void | Promise<void>) {
  const { user } = useUserStore();
  const navigation = useMainNavigation();

  const handlePress = useCallback(async () => {
    if (!user) {
      navigation.navigate(ROOT_ROUTES.AUTH, {
        params: {
          onSuccessLogin: callback,
        },
      });
      return;
    }
    await callback();
  }, [callback, navigation, user]);

  return handlePress;
}
