import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login as kakaoLogin } from "@react-native-kakao/user";
import { useCallback, useEffect } from "react";

export function useKakaoLogin() {
  const initialize = useCallback(() => {
    const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

    try {
      initializeKakaoSDK(kakaoNativeAppKey);
      console.log("Kakao SDK initialized successfully");
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async () => {
    try {
      const tokenInfo = await kakaoLogin();

      if (!tokenInfo.accessToken) {
        throw new Error("Kakao login failed");
      }
      return {
        accessToken: tokenInfo.accessToken,
      };
    } catch (error) {
      throw new Error(`Kakao login failed : ${error}`);
    }
  }, []);

  return { login };
}
