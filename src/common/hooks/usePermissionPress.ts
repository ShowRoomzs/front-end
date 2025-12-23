import { useCallback } from "react";

import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";

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
