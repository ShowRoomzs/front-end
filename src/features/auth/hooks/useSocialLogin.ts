import { useCallback } from "react";

import { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";
import { useKakaoLogin } from "@/features/auth/hooks/useKakaoLogin";
import { useNaverLogin } from "@/features/auth/hooks/useNaverLogin";

/**
 * @description 소셜 로그인 응답 타입
 * @property {string} token - 소셜 로그인 토큰
 * - naver : accessToken
 * - kakao : accessToken
 * - google : accessToken
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
  const { login: loginWithGoogle } = useGoogleLogin();

  const login = useCallback(async (): Promise<SocialLoginResponse> => {
    try {
      let token: string;

      switch (socialType) {
        case "NAVER": {
          const res = await loginWithNaver();

          token = res.accessToken;
          break;
        }
        case "KAKAO": {
          const res = await loginWithKakao();

          token = res.accessToken;
          break;
        }
        case "GOOGLE": {
          const res = await loginWithGoogle();

          token = res.accessToken;
          break;
        }
        case "APPLE":
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
  }, [loginWithGoogle, loginWithKakao, loginWithNaver, socialType]);

  return { login };
}
