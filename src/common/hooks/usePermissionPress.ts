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
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

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
                void callbackRef.current(...stored);
              }
            },
          },
        });
        return;
      }
      await callbackRef.current(...args);
    },
    [navigation, user]
  );

  return handlePress;
}
