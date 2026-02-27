import { useQuery } from "@tanstack/react-query";

import { settingService } from "@/features/setting/services/settingService";

export const NOTIFICATION_SETTINGS_QUERY_KEY = "notification-settings";

export function useGetNotificationSettings() {
  return useQuery({
    queryKey: [NOTIFICATION_SETTINGS_QUERY_KEY],
    queryFn: settingService.getNotificationSettings,
  });
}
