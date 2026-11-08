import * as AppleAuthentication from "expo-apple-authentication";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

type AppleLoginResult = {
  /** 서버가 애플 공개키로 서명을 검증하는 JWT — 서버 `SocialLoginRequest.token` */
  identityToken: string;
  /** 애플은 **첫 로그인 때만** 이름을 준다. 두 번째부터는 비어 있어 보내지 않는다 */
  name?: string;
};

/**
 * Sign in with Apple (iOS).
 *
 * 이름 · 이메일을 함께 요청한다. 애플은 사용자가 처음 승인할 때만 이름을 내려 주고, 그 뒤로는 같은 앱에서
 * 다시 받을 방법이 없다 — 그래서 받은 그 로그인에서 서버로 넘긴다(서버가 신규 가입 때 실명으로 저장).
 *
 * 사용자가 애플 창을 닫으면 `ERR_REQUEST_CANCELED`가 온다 — 실패가 아니므로 「CANCELLED」로 바꿔 던져
 * 버튼 쪽이 조용히 넘기게 한다.
 */
export function useAppleLogin() {
  const login = useCallback(async (): Promise<AppleLoginResult> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("identity token is missing");
      }

      const name = credential.fullName ? AppleAuthentication.formatFullName(credential.fullName).trim() : "";

      return { identityToken: credential.identityToken, name: name || undefined };
    } catch (error) {
      if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED") {
        throw new Error("CANCELLED");
      }
      throw error;
    }
  }, []);

  return { login };
}

/**
 * 이 기기에서 Sign in with Apple을 쓸 수 있는지 — iOS 13 이상 · 애플 계정 로그인 기능이 켜진 빌드.
 * 확인 전(null)에는 버튼을 그리지 않는다. 쓸 수 없는 기기에 눌러도 안 되는 버튼을 두지 않는다.
 */
export function useIsAppleLoginAvailable() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(Platform.OS === "ios" ? null : false);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }
    let isMounted = true;

    AppleAuthentication.isAvailableAsync()
      .then(available => {
        if (isMounted) {
          setIsAvailable(available);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAvailable(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return isAvailable === true;
}
