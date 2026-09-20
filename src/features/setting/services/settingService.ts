import { apiInstance } from "@/common/lib/apiInstance";
import {
  AccountInfo,
  NotificationSettings,
  NotificationSettingsRequest,
} from "@/features/setting/types/notification";
import { RefundAccountResponse, UpdateRefundAccountRequest } from "@/features/setting/types/refundAccount";
import { WithdrawalInfo, WithdrawalRequest } from "@/features/setting/types/withdrawal";

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
  /** C15-2 회원정보 조회 — 서버가 마스킹해서 내려준다 */
  getAccountInfo: async () => {
    const { data } = await apiInstance.get<AccountInfo>("/user/settings/account");

    return data;
  },

  /**
   * C15-2 본인인증 재인증. 서버가 통신사 원장으로 이름·생년월일·성별·휴대폰번호를 갱신하고
   * 최신 회원정보를 돌려준다. 동의는 매번 다시 받는다 — 별개의 수집 행위이기 때문이다.
   */
  reverifyIdentity: async (agreeConsent: boolean) => {
    const { data } = await apiInstance.post<AccountInfo>("/user/settings/account/verifications", {
      agreeConsent,
    });

    return data;
  },

  getRefundAccount: async () => {
    const { data: response } = await apiInstance.get<RefundAccountResponse>("/user/refund-account");

    return response;
  },
  updateRefundAccount: async (data: UpdateRefundAccountRequest) => {
    const { data: response } = await apiInstance.put("/user/refund-account", data);

    return response;
  },
  /** C15-3/4 진입 데이터 — 차단 여부·삭제될 개수·이유 목록을 한 번에 받는다 */
  getWithdrawalInfo: async () => {
    const { data } = await apiInstance.get<WithdrawalInfo>("/user/withdrawal");

    return data;
  },

  withdrawal: async (data: WithdrawalRequest) => {
    const { data: response } = await apiInstance.delete("/user/auth/withdraw", { data });

    return response;
  },
};
