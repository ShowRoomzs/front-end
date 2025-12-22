import { useCallback } from "react";

import { useGoogleLogin } from "./useGoogleLogin";
import { useNaverLogin } from "./useNaverLogin";
import { SocialType } from "../components/SocialButton/SocialButton";

/**
 * @description 소셜 로그인 응답 타입
 * @property {string} token - 소셜 로그인 토큰
 * - naver : accessToken
 * - google : accessToken
 * - apple : identityToken
 */

export type SocialLoginResponse = {
  token: string;
};

interface UseSocialLoginResult {
  login: () => Promise<SocialLoginResponse>;
}

export function useSocialLogin(socialType: SocialType): UseSocialLoginResult {
  const { login: loginWithNaver } = useNaverLogin();
  const { login: loginWithGoogle } = useGoogleLogin();

  const login = useCallback(async (): Promise<SocialLoginResponse> => {
    try {
      let token: string;

      switch (socialType) {
        case "naver": {
          const res = await loginWithNaver();

          token = res.successResponse?.accessToken ?? "";
          break;
        }
        case "google": {
          const res = await loginWithGoogle();

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

      return { token };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      throw new Error(`${socialType} login failed: ${errorMessage}`);
    }
  }, [loginWithGoogle, loginWithNaver, socialType]);

  return { login };
}
