import { useQuery } from "@tanstack/react-query";

import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";

export function useGetNotificationSettings() {
  return useQuery({
    queryKey: [SETTING_QUERY_KEY.NOTIFICATION_SETTINGS],
    queryFn: settingService.getNotificationSettings,
  });
}
