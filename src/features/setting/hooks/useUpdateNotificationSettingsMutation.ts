import { useMutation } from "@tanstack/react-query";

import { settingService } from "@/features/setting/services/settingService";
import { NotificationSettings } from "@/features/setting/types/notification";

/**
 * 성공 후 조회를 무효화하지 않는다 — 화면은 이미 낙관적으로 바뀌어 있고, 여기서 다시 받아오면
 * 디바운스로 묶어 둔 다음 요청과 순서가 엇갈려 스위치가 되돌아가 보인다.
 * 되돌리는 일은 실패했을 때만 하며, 그 판단은 useUpdateNotificationSettings가 한다.
 */
export function useUpdateNotificationSettingsMutation() {
  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => settingService.updateNotificationSettings(data),
  });
}
