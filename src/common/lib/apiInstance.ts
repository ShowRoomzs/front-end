import axios from "axios";
import { getItemAsync } from "expo-secure-store";

import { STORAGE_KEYS } from "@/common/constants/storageKey";

export const apiInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1`,
});

apiInstance.interceptors.request.use(async config => {
  const accessToken = await getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
