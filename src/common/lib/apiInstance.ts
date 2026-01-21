import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { SECURE_STORE } from "@/common/constants/secureStore";
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

apiInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.data.status === 401) {
      const refreshToken = await SecureStore.getItemAsync(SECURE_STORE.REFRESH_TOKEN);

      if (!refreshToken) {
        return Promise.reject(error);
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await authService.refresh(
        refreshToken
      );

      await SecureStore.setItemAsync(SECURE_STORE.ACCESS_TOKEN, newAccessToken);
      await SecureStore.setItemAsync(SECURE_STORE.REFRESH_TOKEN, newRefreshToken);

      return apiInstance(error.config);
    }
  }
);
