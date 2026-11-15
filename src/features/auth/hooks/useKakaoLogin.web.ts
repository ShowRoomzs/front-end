import { useCallback } from "react";

import { createState, getRedirectUri, openOAuthPopup } from "@/features/auth/web/oauthPopup";

/**
 * 카카오 웹 로그인 — 인가 코드 방식. 카카오는 웹에서 액세스 토큰을 브라우저에 직접 주지 않는다.
 *
 * 앱(네이티브 SDK)과 달리 **REST API 키**로 인가 화면을 연다. 받은 코드는 서버가 같은 REST API 키
 * (+ 클라이언트 시크릿)로 토큰과 바꾼다 — 그래야 시크릿이 브라우저에 나오지 않는다.
 * 콘솔: REST API 키 → 로그인 리다이렉트 URI에 `/auth/kakao/callback` 등록됨(11-12).
 *
 * 서버는 `authorizationCode` + `redirectUri`를 받아 교환한다(11-15). redirectUri는 서버 허용 목록
 * (KAKAO_ALLOWED_REDIRECT_URIS — showroomz.co.kr · localhost:8081)에 있어야 한다. 없으면 400 INVALID_REDIRECT_URI.
 */
export function useKakaoLogin() {
  const login = useCallback(async () => {
    const restApiKey = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

    if (!restApiKey) {
      throw new Error("카카오 웹 로그인 설정(EXPO_PUBLIC_KAKAO_REST_API_KEY)이 없어요");
    }

    const state = createState();
    const redirectUri = getRedirectUri("kakao");
    const query = new URLSearchParams({
      client_id: restApiKey,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
    });
    const params = await openOAuthPopup("kakao", `https://kauth.kakao.com/oauth/authorize?${query}`, state);

    if (!params.code) {
      throw new Error("Kakao login failed: authorization code is missing");
    }

    return { authorizationCode: params.code, redirectUri };
  }, []);

  return { login };
}
