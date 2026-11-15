import { Platform } from "react-native";

import { authInstance } from "@/common/lib/authInstance";
import { refreshInstance } from "@/common/lib/refreshInstance";
import {
  RegisterRequest,
  RegisterResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/features/auth/types/auth";

/** 웹이면 `platform: "WEB"` — 서버가 리프레시 토큰을 쿠키로 내린다(authInstance 참고) */
function withWebPlatform<T extends object>(body: T): T {
  return Platform.OS === "web" ? { ...body, platform: "WEB" } : body;
}

export const authService = {
  socialLogin: async (request: SocialLoginRequest): Promise<SocialLoginResponse> => {
    const { data: response } = await authInstance.post<SocialLoginResponse>(
      "/social/login",
      withWebPlatform(request)
    );

    return response;
  },
  register: async (request: RegisterRequest, registerToken: string): Promise<RegisterResponse> => {
    const { data: response } = await authInstance.post<RegisterResponse>(
      "/social/signup",
      withWebPlatform(request),
      {
        headers: {
          Authorization: `Bearer ${registerToken}`,
        },
      }
    );

    return response;
  },
  /** 웹은 리프레시 토큰을 갖고 있지 않다 — 빈 값을 보내면 서버가 쿠키를 읽는다. 응답의 refreshToken도 웹은 비어 온다 */
  refresh: async (refreshToken: string): Promise<RegisterResponse> => {
    const { data: response } = await refreshInstance.post<RegisterResponse>("/refresh", { refreshToken });

    return response;
  },

  /**
   * 서버 로그아웃 — 웹 전용으로 부른다. 웹의 리프레시 토큰은 httpOnly 쿠키라 앱 코드가 지울 수 없어, 서버가
   * 지우게 해야 다음 401 때 쿠키로 조용히 다시 로그인되지 않는다. 앱은 지금처럼 기기의 토큰만 지운다
   */
  logout: async (accessToken: string) => {
    await authInstance.post("/logout", {}, { headers: { Authorization: `Bearer ${accessToken}` } });
  },
};
