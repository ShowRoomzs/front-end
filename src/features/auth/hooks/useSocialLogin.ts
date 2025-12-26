import { useCallback } from "react";

import { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { useKakaoLogin } from "@/features/auth/hooks/useKakaoLogin";
import { useNaverLogin } from "@/features/auth/hooks/useNaverLogin";

/**
 * @description 소셜 로그인 응답 타입
 * @property {string} token - 소셜 로그인 토큰
 * - naver : accessToken
 * - kakao : accessToken
 * - apple : identityToken
 */

export type SocialLoginResponse = {
  token: string;
  socialType: SocialType;
};

interface UseSocialLoginResult {
  login: () => Promise<SocialLoginResponse>;
}

export function useSocialLogin(socialType: SocialType): UseSocialLoginResult {
  const { login: loginWithNaver } = useNaverLogin();
  const { login: loginWithKakao } = useKakaoLogin();

  const login = useCallback(async (): Promise<SocialLoginResponse> => {
    try {
      let token: string;

      switch (socialType) {
        case "naver": {
          const res = await loginWithNaver();

          token = res.accessToken;
          break;
        }
        case "kakao": {
          const res = await loginWithKakao();

          token = res.accessToken;
          break;
        }
        case "apple":
          throw new Error("Apple login is not implemented yet");

        default:
          throw new Error(`Unsupported social type: ${socialType}`);
      }

      if (!token) {
        throw new Error(`${socialType} login failed: token is missing`);
      }

      return { token, socialType };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      throw new Error(`${socialType} login failed: ${errorMessage}`);
    }
  }, [loginWithKakao, loginWithNaver, socialType]);

  return { login };
}
