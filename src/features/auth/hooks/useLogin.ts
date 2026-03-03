import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

import { SECURE_STORE } from "@/common/constants/secureStore";
import { useUserStore } from "@/common/stores/useUserStore";
import { RegisterResponse } from "@/features/auth/types/auth";
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
    await SecureStore.deleteItemAsync(SECURE_STORE.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE.REFRESH_TOKEN);
    clear();
  }, [clear]);

  return { login, logout };
}
