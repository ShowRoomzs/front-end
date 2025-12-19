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

  const login = async (): Promise<void> => {
    try {
      const res = await NaverLogin.login();

      console.log(res);
      // TODO : 서버 요청
    } catch (err) {
      console.log(err);
    }
  };

  return {
    login,
  };
}
