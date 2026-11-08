import { useCallback } from "react";

import { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { useAppleLogin } from "@/features/auth/hooks/useAppleLogin";
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
  providerType: SocialType;
  /** 애플 첫 로그인에서만 — 서버가 신규 가입 때 실명으로 저장한다 */
  name?: string;
};

interface UseSocialLoginResult {
  login: () => Promise<SocialLoginResponse>;
}

export function useSocialLogin(socialType: SocialType): UseSocialLoginResult {
  const { login: loginWithNaver } = useNaverLogin();
  const { login: loginWithKakao } = useKakaoLogin();
  const { login: loginWithGoogle } = useGoogleLogin();
  const { login: loginWithApple } = useAppleLogin();

  const login = useCallback(async (): Promise<SocialLoginResponse> => {
    try {
      let token: string;
      let name: string | undefined;

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
        case "APPLE": {
          const res = await loginWithApple();

          token = res.identityToken;
          name = res.name;
          break;
        }

        default:
          throw new Error(`Unsupported social type: ${socialType}`);
      }

      if (!token) {
        throw new Error(`${socialType} login failed: token is missing`);
      }

      return { token, providerType: socialType, name };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      throw new Error(`${socialType} login failed: ${errorMessage}`);
    }
  }, [loginWithApple, loginWithGoogle, loginWithKakao, loginWithNaver, socialType]);

  return { login };
}
