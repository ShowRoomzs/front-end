import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef } from "react";

WebBrowser.maybeCompleteAuthSession();

type GoogleLoginResult = {
  accessToken: string;
};

export function useGoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
    scopes: ["profile", "email"],
  });

  const pendingPromiseRef = useRef<{
    resolve: (value: GoogleLoginResult) => void;
    reject: (error: Error) => void;
  } | null>(null);

  useEffect(() => {
    if (!pendingPromiseRef.current || !response) {
      return;
    }

    const { resolve, reject } = pendingPromiseRef.current;

    if (response.type === "success") {
      const { authentication } = response;

      if (authentication?.accessToken) {
        resolve({ accessToken: authentication.accessToken });
      } else {
        reject(new Error("Google login failed: access token is missing"));
      }
      pendingPromiseRef.current = null;
    } else if (response.type === "error") {
      reject(new Error(`Google login failed: ${response.error?.message || "Unknown error"}`));
      pendingPromiseRef.current = null;
    } else if (response.type === "dismiss") {
      reject(new Error("Google login was cancelled"));
      pendingPromiseRef.current = null;
    }
  }, [response]);

  const login = useCallback(async (): Promise<GoogleLoginResult> => {
    if (!request) {
      throw new Error("Google login request is not ready");
    }

    if (pendingPromiseRef.current) {
      throw new Error("Google login is already in progress");
    }

    return new Promise<GoogleLoginResult>((resolve, reject) => {
      pendingPromiseRef.current = { resolve, reject };

      promptAsync().catch(error => {
        pendingPromiseRef.current = null;
        reject(new Error(`Google login error: ${error}`));
      });
    });
  }, [request, promptAsync]);

  return {
    login,
  };
}
