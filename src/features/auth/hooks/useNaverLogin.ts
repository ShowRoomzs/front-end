import NaverLogin from "@react-native-seoul/naver-login";
import { useEffect } from "react";

export function useNaverLogin() {
  useEffect(() => {
    NaverLogin.initialize({
      appName: "showroomz",
      consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID,
      consumerSecret: process.env.EXPO_PUBLIC_NAVER_SECRET_KEY,
      serviceUrlSchemeIOS: `naver${process.env.EXPO_PUBLIC_NAVER_CLIENT_ID}`,
    });
  }, []);

  return {
    login: NaverLogin.login,
  };
}
