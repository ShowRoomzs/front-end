import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

import { STORAGE_KEYS } from "@/common/constants/storageKey";
import { useUserStore } from "@/common/stores/useUserStore";
import { RegisterResponse } from "@/features/auth/services/authService";
import { userService } from "@/features/user/services/userService";

// 로그인, 회원가입 > 로그인 시 공통적으로 사용
export function useLogin() {
  const { setUser } = useUserStore();

  const handleLogin = useCallback(
    async (response: RegisterResponse) => {
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

      const user = await userService.getUserInfo();

      setUser(user);
    },
    [setUser]
  );

  return { handleLogin };
}
