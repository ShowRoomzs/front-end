import { Platform } from "react-native";

import { apiInstance } from "@/common/lib/apiInstance";

export const pushService = {
  /**
   * 이 기기의 FCM 토큰을 로그인한 계정에 등록 · 갱신한다(`PUT /v1/user/device-token`, 백엔드 11-15).
   * 같은 토큰이 다른 계정에 있었으면 서버가 이번 계정으로 옮긴다.
   */
  registerDeviceToken: async (fcmToken: string) => {
    await apiInstance.put("/user/device-token", {
      fcmToken,
      platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
    });
  },
};
