import NaverLogin from "@react-native-seoul/naver-login";
import { useEffect, useCallback } from "react";

import { NAVER_URL_SCHEME } from "@/features/auth/constants/naver";

export function useNaverLogin() {
  useEffect(() => {
    NaverLogin.initialize({
      appName: "showroomz",
      consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID!,
      consumerSecret: process.env.EXPO_PUBLIC_NAVER_SECRET_KEY!,
      serviceUrlSchemeIOS: NAVER_URL_SCHEME,
    });
  }, []);

  const login = useCallback(async () => {
    const res = await NaverLogin.login();

    if (!res.isSuccess || !res.successResponse?.accessToken) {
      if (res.failureResponse?.isCancel) {
        throw new Error("NAVER_LOGIN_CANCELLED");
      }

      throw new Error(res.failureResponse?.message ?? "NAVER_LOGIN_FAILED");
    }

    return {
      accessToken: res.successResponse.accessToken,
    };
  }, []);

  return { login };
}
