import { useCallback, useEffect } from "react";

import { APPLE_WEB_SERVICE_ID } from "@/features/auth/constants/apple";

/** 애플이 제공하는 Sign in with Apple JS — 팝업 창과 결과 전달을 애플 스크립트가 맡는다 */
const APPLE_JS_SDK = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/ko_KR/appleid.auth.js";

interface AppleSignInResponse {
  authorization: { id_token: string; code: string; state?: string };
  user?: { name?: { firstName?: string; lastName?: string }; email?: string };
}

interface AppleIdAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    state?: string;
    usePopup: boolean;
  }) => void;
  signIn: () => Promise<AppleSignInResponse>;
}

declare global {
  interface Window {
    AppleID?: { auth: AppleIdAuth };
  }
}

let sdkPromise: Promise<AppleIdAuth> | null = null;

function loadAppleSdk(): Promise<AppleIdAuth> {
  if (window.AppleID) {
    return Promise.resolve(window.AppleID.auth);
  }
  sdkPromise ??= new Promise<AppleIdAuth>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = APPLE_JS_SDK;
    script.async = true;
    script.onload = () =>
      window.AppleID ? resolve(window.AppleID.auth) : reject(new Error("AppleID is missing"));
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("애플 로그인 스크립트를 불러오지 못했어요"));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/**
 * Sign in with Apple (웹).
 *
 * 이름 · 이메일을 받으려면 애플이 결과를 redirect URI로 **POST**(form_post)하는데, 정적 호스팅(S3)은
 * POST를 받지 못한다. 애플 JS의 팝업 모드(`usePopup`)는 결과를 스크립트로 돌려줘서 서버 없이 받을 수 있다.
 * redirect URI는 그래도 콘솔에 등록한 값과 같아야 한다.
 *
 * 앱과 같은 모양을 돌려준다 — `identityToken`은 서버 `token`, 이름은 **첫 로그인 때만** 온다.
 */
export function useAppleLogin() {
  // 버튼을 누르기 전에 스크립트를 받아 둔다 — 누른 뒤 await로 받으면 브라우저가 팝업을 사용자 동작으로 보지 않아 막는다
  useEffect(() => {
    loadAppleSdk().catch(() => undefined);
  }, []);

  const login = useCallback(async () => {
    const auth = window.AppleID?.auth ?? (await loadAppleSdk());

    auth.init({
      clientId: APPLE_WEB_SERVICE_ID,
      scope: "name email",
      redirectURI: `${window.location.origin}/auth/apple/callback`,
      usePopup: true,
    });

    try {
      const { authorization, user } = await auth.signIn();
      const name = [user?.name?.lastName, user?.name?.firstName].filter(Boolean).join("").trim();

      if (!authorization?.id_token) {
        throw new Error("identity token is missing");
      }

      return { identityToken: authorization.id_token, name: name || undefined };
    } catch (error) {
      // 사용자가 애플 창을 닫음 — 실패가 아니다
      if ((error as { error?: string })?.error === "popup_closed_by_user") {
        throw new Error("CANCELLED");
      }
      throw error instanceof Error ? error : new Error(JSON.stringify(error));
    }
  }, []);

  return { login };
}

/** 웹은 Services ID가 있으면 버튼을 보인다(브라우저와 관계없이 애플 계정으로 로그인할 수 있다) */
export function useIsAppleLoginAvailable() {
  return APPLE_WEB_SERVICE_ID.length > 0;
}
