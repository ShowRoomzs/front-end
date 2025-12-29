import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { SECURE_STORE } from "@/common/constants/secureStore";

export const refreshInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1/auth`,
});

refreshInstance.interceptors.response.use(
  res => res,
  error => {
    // TODO : 리프레시 토큰 만료 시 처리
    if (error.response.data.status === 401) {
      SecureStore.deleteItemAsync(SECURE_STORE.REFRESH_TOKEN);
      SecureStore.deleteItemAsync(SECURE_STORE.ACCESS_TOKEN);
    }
    return Promise.reject(error);
  }
);
