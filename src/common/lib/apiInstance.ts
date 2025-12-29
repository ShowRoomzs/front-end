import axios from "axios";
import { getItemAsync } from "expo-secure-store";

import { SECURE_STORE } from "@/common/constants/secureStore";

export const apiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1`,
});

apiInstance.interceptors.request.use(async config => {
  const accessToken = await getItemAsync(SECURE_STORE.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
