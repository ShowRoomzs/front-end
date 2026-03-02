import { useMutation } from "@tanstack/react-query";
import react from "react";

import { queryClient } from "@/common/lib/queryClient";
import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";
import { NotificationSettings } from "@/features/setting/types/notification";

const getInvalidateFns = () => {
  return [() => queryClient.invalidateQueries({ queryKey: [SETTING_QUERY_KEY.NOTIFICATION_SETTINGS] })];
};

export function useUpdateNotificationSettingsMutation() {
  const [cleanupFns, setCleanupFns] = react.useState<ReturnType<typeof getInvalidateFns>>([]);

  const query = useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => settingService.updateNotificationSettings(data),
    onSuccess: () => {
      setCleanupFns(getInvalidateFns());
    },
  });

  return {
    ...query,
    cleanupFns,
  };
}
