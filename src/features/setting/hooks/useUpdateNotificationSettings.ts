import { useCallback, useRef } from "react";
import { debounce } from "remeda";

import { queryClient } from "@/common/lib/queryClient";
import { toast } from "@/common/providers/ToastProvider";
import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { useUpdateNotificationSettingsMutation } from "@/features/setting/hooks/useUpdateNotificationSettingsMutation";
import { NotificationSettings } from "@/features/setting/types/notification";

/**
 * C15 알림 토글 — 화면은 즉시 바꾸고, 서버 요청만 묶는다.
 *
 * 토글의 값은 조회 캐시에서 나온다. 그래서 요청이 끝난 뒤에야 캐시를 갱신하면, 누르고
 * 0.5초(디바운스) + 왕복 시간 동안 스위치가 제자리에 멈춰 있어 **먹지 않는 것처럼 보인다**.
 * 켜고 끄는 조작은 결과를 기다릴 이유가 없으므로 캐시를 먼저 바꾸고 요청을 뒤로 보낸다.
 *
 * 디바운스는 그대로 둔다 — 빠르게 여러 번 누를 때 마지막 상태 한 번만 보내면 된다.
 * 실패하면 서버 값을 다시 받아 되돌린다. 직전 값으로 되돌리지 않는 이유는, 디바운스 구간에서
 * 여러 번 눌렸을 경우 "직전 값"이 무엇인지 화면과 어긋날 수 있어서다.
 */
const DEBOUNCED_WAIT_MS = 500;

const NOTIFICATION_SETTINGS_KEY = [SETTING_QUERY_KEY.NOTIFICATION_SETTINGS];

export function useUpdateNotificationSettings() {
  const { mutateAsync } = useUpdateNotificationSettingsMutation();
  const debouncedMapRef = useRef<Map<keyof NotificationSettings, ReturnType<typeof debounce>>>(new Map());

  const update = useCallback(
    async (field: keyof NotificationSettings, value: boolean) => {
      try {
        await mutateAsync({ [field]: value });
      } catch {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_SETTINGS_KEY });
        toast.show("알림 설정을 변경하지 못했어요");
      }
    },
    [mutateAsync]
  );

  const updateDebounced = useCallback(
    (field: keyof NotificationSettings, value: boolean) => {
      queryClient.setQueryData<NotificationSettings>(NOTIFICATION_SETTINGS_KEY, prev =>
        prev ? { ...prev, [field]: value } : prev
      );

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

  return { updateDebounced };
}
