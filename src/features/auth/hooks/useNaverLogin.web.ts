import { useCallback } from "react";

import { createState, getRedirectUri, openOAuthPopup } from "@/features/auth/web/oauthPopup";

/**
 * 네이버 웹 로그인 — 암묵적 흐름(response_type=token)으로 팝업에서 액세스 토큰을 바로 받는다.
 *
 * 받은 토큰은 앱과 똑같이 서버 `SocialLoginRequest.token`으로 간다(서버가 openapi.naver.com/v1/nid/me 조회).
 * 네이버 회원 번호는 애플리케이션마다 달라서 **앱과 같은 Client ID**를 써야 같은 회원으로 잡힌다.
 *
 * 앱용 `EXPO_PUBLIC_NAVER_SECRET_KEY`는 쓰지 않는다 — 이 파일이 앱 파일을 대신하므로 웹 번들에 시크릿이 실리지 않는다.
 */
export function useNaverLogin() {
  const login = useCallback(async () => {
    const state = createState();
    const query = new URLSearchParams({
      response_type: "token",
      client_id: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
      redirect_uri: getRedirectUri("naver"),
      state,
    });
    const params = await openOAuthPopup("naver", `https://nid.naver.com/oauth2.0/authorize?${query}`, state);

    if (!params.access_token) {
      throw new Error("NAVER_LOGIN_FAILED: access token is missing");
    }

    return { accessToken: params.access_token };
  }, []);

  return { login };
}
