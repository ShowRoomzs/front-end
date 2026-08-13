import { useCallback, useRef } from "react";
import { debounce } from "remeda";

import { useUpdateNotificationSettingsMutation } from "@/features/setting/hooks/useUpdateNotificationSettingsMutation";
import { NotificationSettings } from "@/features/setting/types/notification";

const DEBOUNCED_WAIT_MS = 500;

export function useUpdateNotificationSettings() {
  const { mutateAsync, cleanupFns } = useUpdateNotificationSettingsMutation();
  const debouncedMapRef = useRef<Map<keyof NotificationSettings, ReturnType<typeof debounce>>>(new Map());

  const update = useCallback(
    async (field: keyof NotificationSettings, value: boolean) => {
      await mutateAsync({ [field]: value });
    },
    [mutateAsync]
  );

  const updateDebounced = useCallback(
    (field: keyof NotificationSettings, value: boolean) => {
      let debounced = debouncedMapRef.current.get(field);

      if (!debounced) {
        debounced = debounce(
          (newValue: boolean) => {
            update(field, newValue);
          },
          { waitMs: DEBOUNCED_WAIT_MS }
        );

        debouncedMapRef.current.set(field, debounced);
      }

      debounced.call(value);
    },
    [update]
  );

  return { updateDebounced, cleanupFns };
}
