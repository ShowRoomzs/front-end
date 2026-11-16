import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

import { SECURE_STORE } from "@/common/constants/secureStore";
import { useUserStore } from "@/common/stores/useUserStore";
import { RegisterResponse } from "@/features/auth/types/auth";
import { deletePushToken } from "@/features/push/lib/pushMessaging";
import { userService } from "@/features/user/services/userService";

// 로그인, 회원가입 > 로그인 시 공통적으로 사용
export function useLogin() {
  const { setUser, clear } = useUserStore();

  const login = useCallback(
    async (response: RegisterResponse) => {
      await SecureStore.setItemAsync(SECURE_STORE.ACCESS_TOKEN, response.accessToken);
      await SecureStore.setItemAsync(SECURE_STORE.REFRESH_TOKEN, response.refreshToken);

      const user = await userService.get();

      setUser(user);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    // 이 기기 푸시 토큰을 무효로 — 로그아웃한 계정의 알림이 계속 오지 않게. 실패해도 로그아웃은 그대로 한다
    await deletePushToken().catch(() => undefined);
    await SecureStore.deleteItemAsync(SECURE_STORE.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE.REFRESH_TOKEN);
    clear();
  }, [clear]);

  return { login, logout };
}
