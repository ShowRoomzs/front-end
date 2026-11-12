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
  /**
   * 카카오 **웹**만 — 카카오는 웹에서 토큰 대신 인가 코드를 준다(`useKakaoLogin.web.ts`).
   * 서버가 이 코드를 같은 redirectUri로 토큰과 바꾼다. 이때 `token`은 빈 문자열이다
   */
  authorizationCode?: string;
  redirectUri?: string;
};

/** 카카오 훅의 결과 — 앱은 accessToken, 웹은 인가 코드 */
type KakaoLoginResult = { accessToken?: string; authorizationCode?: string; redirectUri?: string };

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
      let token = "";
      let name: string | undefined;
      let authorizationCode: string | undefined;
      let redirectUri: string | undefined;

      switch (socialType) {
        case "NAVER": {
          const res = await loginWithNaver();

          token = res.accessToken;
          break;
        }
        case "KAKAO": {
          const res: KakaoLoginResult = await loginWithKakao();

          token = res.accessToken ?? "";
          authorizationCode = res.authorizationCode;
          redirectUri = res.redirectUri;
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

      if (!token && !authorizationCode) {
        throw new Error(`${socialType} login failed: token is missing`);
      }

      return { token, providerType: socialType, name, authorizationCode, redirectUri };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      throw new Error(`${socialType} login failed: ${errorMessage}`);
    }
  }, [loginWithApple, loginWithGoogle, loginWithKakao, loginWithNaver, socialType]);

  return { login };
}
