import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { SECURE_STORE } from "@/common/constants/secureStore";
import { useUserStore } from "@/common/stores/useUserStore";
import { authService } from "@/features/auth/services/authService";

export const apiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1`,
});

apiInstance.interceptors.request.use(async config => {
  const accessToken = await SecureStore.getItemAsync(SECURE_STORE.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** 리프레시로 한 번 다시 보낸 요청 — 또 401이 와도 다시 리프레시하지 않게 표시해 둔다 */
type RetriedConfig = InternalAxiosRequestConfig & { isRetriedAfterRefresh?: boolean };

/**
 * 저장된 세션을 버린다.
 *
 * 토큰만 지우고 스토어를 그대로 두면 화면은 로그인된 것처럼 보이는데 모든 요청이 401로
 * 떨어진다. 둘은 항상 같이 움직여야 한다.
 */
async function clearSession() {
  await SecureStore.deleteItemAsync(SECURE_STORE.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(SECURE_STORE.REFRESH_TOKEN);
  useUserStore.getState().clear();
}

/**
 * 401이면 리프레시 토큰으로 한 번 되살려 보고, 안 되면 세션을 버린다.
 *
 * 예전에는 `error.response.data.status`를 봤는데 **서버 응답 본문에는 `status`가 없다**
 * (`ErrorResponse`는 `code`와 `message`뿐이다). 그래서 이 분기가 한 번도 참이 된 적이 없고,
 * 만료된 토큰은 갱신도 삭제도 되지 않은 채 남아 앱을 켤 때마다 401이 났다.
 * HTTP 상태 코드(`error.response.status`)를 본다.
 */
apiInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as RetriedConfig | undefined;

    if (error.response?.status !== 401 || !config || config.isRetriedAfterRefresh) {
      return Promise.reject(error);
    }

    const refreshToken = await SecureStore.getItemAsync(SECURE_STORE.REFRESH_TOKEN);

    if (!refreshToken) {
      await clearSession();

      return Promise.reject(error);
    }

    try {
      const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } =
        await authService.refresh(refreshToken);

      await SecureStore.setItemAsync(SECURE_STORE.ACCESS_TOKEN, nextAccessToken);
      await SecureStore.setItemAsync(SECURE_STORE.REFRESH_TOKEN, nextRefreshToken);

      config.isRetriedAfterRefresh = true;

      return apiInstance(config);
    } catch {
      // 리프레시가 401이면 refreshInstance가 이미 정리했지만, 네트워크 오류 등으로 실패했을 때도
      // 이 세션으로는 더 부를 수 없다. 원래 오류를 그대로 돌려줘 호출부가 401로 판단하게 둔다
      await clearSession();

      return Promise.reject(error);
    }
  }
);
