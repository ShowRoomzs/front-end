import { useCallback, useRef } from "react";

import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";

export function usePermissionPress<Args extends Array<unknown>>(
  callback: (...args: Args) => void | Promise<void>
) {
  const { user } = useUserStore();
  const navigation = useMainNavigation();
  const pendingArgsRef = useRef<Args | null>(null);

  const handlePress = useCallback(
    async (...args: Args) => {
      if (!user) {
        pendingArgsRef.current = args;
        navigation.navigate(ROOT_ROUTES.AUTH, {
          params: {
            onSuccessLogin: () => {
              const stored = pendingArgsRef.current;

              pendingArgsRef.current = null;
              if (stored) {
                void callback(...stored);
              }
            },
          },
        });
        return;
      }
      await callback(...args);
    },
    [callback, navigation, user]
  );

  return handlePress;
}
