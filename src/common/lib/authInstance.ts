import axios from "axios";
import { Platform } from "react-native";

import { API_ORIGIN } from "@/common/lib/apiOrigin";

/**
 * 웹은 리프레시 토큰을 **httpOnly 쿠키**로 주고받는다(백엔드 WebRefreshTokenCookie · 11-15) — 로그인 · 가입에
 * `platform: "WEB"`을 실으면 서버가 리프레시 토큰을 바디에서 빼고 쿠키로 내린다. 브라우저가 그 쿠키를 저장 · 전송하려면
 * 인증 경로 요청에 자격 증명(withCredentials)이 실려야 한다. 앱은 지금처럼 바디로 주고받는다
 */
export const authInstance = axios.create({
  withCredentials: Platform.OS === "web",
  baseURL: `${API_ORIGIN}/v1/user/auth`,
});
