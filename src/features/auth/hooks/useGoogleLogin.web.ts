import { useCallback } from "react";

import { createState, getRedirectUri, openOAuthPopup } from "@/features/auth/web/oauthPopup";

/**
 * 구글 웹 로그인 — 웹 OAuth 클라이언트(`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`)로 팝업을 열어 액세스 토큰을 받는다.
 *
 * 앱은 expo-auth-session을 쓰지만 웹에서는 그 리디렉션 주소가 콘솔에 등록한 `/auth/google/callback`과
 * 달라, 다른 공급자와 같은 팝업 · 콜백 경로로 맞춘다. 서버는 앱과 똑같이 accessToken을 받는다.
 */
export function useGoogleLogin() {
  const login = useCallback(async () => {
    const state = createState();
    const query = new URLSearchParams({
      client_id: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
      redirect_uri: getRedirectUri("google"),
      response_type: "token",
      scope: "openid email profile",
      include_granted_scopes: "true",
      prompt: "select_account",
      state,
    });
    const params = await openOAuthPopup(
      "google",
      `https://accounts.google.com/o/oauth2/v2/auth?${query}`,
      state
    );

    if (!params.access_token) {
      throw new Error("Google login failed: access token is missing");
    }

    return { accessToken: params.access_token };
  }, []);

  return { login };
}
