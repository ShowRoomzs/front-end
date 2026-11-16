import { useCallback } from "react";
import { Platform } from "react-native";

import { SECURE_STORE } from "@/common/constants/secureStore";
import * as SecureStore from "@/common/lib/secureStorage";
import { useUserStore } from "@/common/stores/useUserStore";
import { authService } from "@/features/auth/services/authService";
import { RegisterResponse } from "@/features/auth/types/auth";
import { deletePushToken } from "@/features/push/lib/pushMessaging";
import { userService } from "@/features/user/services/userService";

// 로그인, 회원가입 > 로그인 시 공통적으로 사용
export function useLogin() {
  const { setUser, clear } = useUserStore();

  const login = useCallback(
    async (response: RegisterResponse) => {
      await SecureStore.setItemAsync(SECURE_STORE.ACCESS_TOKEN, response.accessToken);
      // 웹은 리프레시 토큰이 쿠키로만 온다(바디에 없다) — 없는 값을 저장하면 "undefined" 글자가 남는다
      if (response.refreshToken) {
        await SecureStore.setItemAsync(SECURE_STORE.REFRESH_TOKEN, response.refreshToken);
      }

      const user = await userService.get();

      setUser(user);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    // 웹 — 리프레시 쿠키는 서버만 지울 수 있다. 실패해도(이미 만료 등) 기기 쪽 정리는 그대로 한다
    if (Platform.OS === "web") {
      const accessToken = await SecureStore.getItemAsync(SECURE_STORE.ACCESS_TOKEN);

      if (accessToken) {
        await authService.logout(accessToken).catch(() => undefined);
      }
    }
    // 이 기기 푸시 토큰을 무효로 — 로그아웃한 계정의 알림이 계속 오지 않게. 실패해도 로그아웃은 그대로 한다
    await deletePushToken().catch(() => undefined);
    await SecureStore.deleteItemAsync(SECURE_STORE.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE.REFRESH_TOKEN);
    clear();
  }, [clear]);

  return { login, logout };
}
