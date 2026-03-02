import { apiInstance } from "@/common/lib/apiInstance";
import { NotificationSettings, NotificationSettingsRequest } from "@/features/setting/types/notification";
import {
  RefundAccountResponse,
  UpdateRefundAccountRequest,
  WithdrawalRequest,
} from "@/features/setting/types/refundAccount";

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
  getRefundAccount: async () => {
    const { data: response } = await apiInstance.get<RefundAccountResponse>("/user/refund-account");

    return response;
  },
  updateRefundAccount: async (data: UpdateRefundAccountRequest) => {
    const { data: response } = await apiInstance.put("/user/refund-account", data);

    return response;
  },
  withdrawal: async (data: WithdrawalRequest) => {
    const { data: response } = await apiInstance.delete("/user/auth/withdrawal", { data });

    return response;
  },
};
