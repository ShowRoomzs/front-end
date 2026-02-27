import { apiInstance } from "@/common/lib/apiInstance";
import { NotificationSettings, NotificationSettingsRequest } from "@/features/setting/types/notification";

export const settingService = {
  getNotificationSettings: async () => {
    const { data: response } = await apiInstance.get<NotificationSettings>("/user/settings/notifications");

    return response;
  },
  updateNotificationSettings: async (data: Partial<NotificationSettingsRequest>) => {
    const { data: response } = await apiInstance.patch<NotificationSettingsRequest>(
      "/user/settings/notifications",
      data
    );

    return response;
  },
};
