import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { SECURE_STORE } from "@/common/constants/secureStore";
import { queryClient } from "@/common/lib/queryClient";
import { useUserStore } from "@/common/stores/useUserStore";
import { ACCOUNT_STATUS_QUERY_KEY } from "@/features/account/constants/suspension";
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

/** 진행 중인 리프레시 — 동시에 401이 여러 개 와도 리프레시는 한 번만 보낸다 */
let refreshPromise: Promise<void> | null = null;

/**
 * 리프레시 토큰으로 새 토큰을 받아 저장한다.
 *
 * 서버는 리프레시 토큰이 만료 3일 안으로 들어오면 리프레시할 때마다 새것으로 바꾸고 옛것은 버린다.
 * 앱을 켤 때처럼 요청 여러 개가 한꺼번에 401을 받고 각자 리프레시하면, 첫 번째만 성공하고
 * 나머지는 버려진 토큰을 보내 401을 받아 멀쩡한 세션을 지운다. 그래서 진행 중인 것을 함께 기다린다.
 */
function refreshTokens(refreshToken: string) {
  refreshPromise ??= authService
    .refresh(refreshToken)
    .then(async ({ accessToken, refreshToken: nextRefreshToken }) => {
      await SecureStore.setItemAsync(SECURE_STORE.ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(SECURE_STORE.REFRESH_TOKEN, nextRefreshToken);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
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

    // C20 — 정지된 뒤 처음 막힌 요청이다. 계정 상태를 다시 받아 배너 · 비활성을 바로 그린다(서버 문서의 재조회 시점)
    if (
      error.response?.status === 409 &&
      (error.response.data as { code?: string })?.code === "USER_SUSPENDED"
    ) {
      void queryClient.invalidateQueries({ queryKey: [ACCOUNT_STATUS_QUERY_KEY] });
    }

    if (error.response?.status !== 401 || !config || config.isRetriedAfterRefresh) {
      return Promise.reject(error);
    }

    const refreshToken = await SecureStore.getItemAsync(SECURE_STORE.REFRESH_TOKEN);

    if (!refreshToken) {
      await clearSession();

      return Promise.reject(error);
    }

    try {
      await refreshTokens(refreshToken);
    } catch (refreshError) {
      // 서버가 리프레시 토큰을 거절했을 때(401)만 세션을 버린다. 네트워크 오류는 토큰이 멀쩡하므로
      // 남겨 두고, 연결이 돌아온 뒤의 요청이 다시 리프레시하게 한다. 원래 오류를 그대로 돌려준다
      if ((refreshError as AxiosError).response?.status === 401) {
        await clearSession();
      }

      return Promise.reject(error);
    }

    config.isRetriedAfterRefresh = true;

    return apiInstance(config);
  }
);
