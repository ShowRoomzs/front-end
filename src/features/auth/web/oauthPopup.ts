/**
 * 웹 소셜 로그인 팝업 — 카카오 · 네이버 · 구글 공용 (웹 전용 파일에서만 부른다).
 *
 * **왜 팝업인가:** 현재 창을 공급자 화면으로 넘기면(리디렉션) 돌아올 때 앱이 처음부터 다시 뜬다.
 * 로그인 모달 · 「로그인하면 이어서 할 일」(onSuccessLogin) · 신규 회원의 본인인증 흐름이 모두 메모리에
 * 있어서 사라진다. 팝업으로 열면 원래 창은 그대로 남고, 앱 흐름은 토큰만 받아 앱과 똑같이 이어진다.
 *
 * **결과 전달:** 팝업은 공급자 화면을 거쳐 `/auth/{공급자}/callback`으로 돌아오고, 그 페이지가
 * BroadcastChannel로 결과를 보낸 뒤 스스로 닫는다(`oauthCallback.web.ts`). `window.opener`를 쓰지 않는다 —
 * 구글처럼 Cross-Origin-Opener-Policy를 거는 화면을 지나면 opener 연결이 끊긴다.
 *
 * **주소:** 콜백 주소는 지금 열린 출처(`window.location.origin`)로 만든다. 도메인을 코드에 적지 않는다 —
 * 콘솔에는 `https://showroomz.co.kr/auth/{공급자}/callback`과 개발용 `http://localhost:8081/…`이 등록돼 있다.
 */

export type OAuthProvider = "kakao" | "naver" | "google";

export const OAUTH_CHANNEL = "showroomz-oauth";
/** BroadcastChannel이 없는 브라우저(오래된 사파리)용 — 다른 창의 storage 이벤트로 받는다 */
export const OAUTH_STORAGE_KEY = "showroomz-oauth-result";

export interface OAuthCallbackMessage {
  provider: OAuthProvider;
  state: string;
  params: Record<string, string>;
}

const CALLBACK_PATH = /^\/auth\/(kakao|naver|google)\/callback\/?$/;

export function getRedirectUri(provider: OAuthProvider) {
  return `${window.location.origin}/auth/${provider}/callback`;
}

/** 지금 주소가 콜백 페이지면 공급자 이름을 돌려준다 */
export function matchCallbackPath(pathname: string): OAuthProvider | null {
  const match = CALLBACK_PATH.exec(pathname);

  return match ? (match[1] as OAuthProvider) : null;
}

/** CSRF 방지용 state — 팝업이 돌려준 값이 이 창이 보낸 값과 같을 때만 받는다 */
export function createState() {
  const bytes = new Uint8Array(16);

  crypto.getRandomValues(bytes);

  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

/** 쿼리와 해시(#) 둘 다 읽는다 — 카카오는 쿼리(code), 네이버 · 구글 암묵적 흐름은 해시(access_token)로 준다 */
export function readCallbackParams(location: Location): Record<string, string> {
  const params: Record<string, string> = {};
  const hash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;

  new URLSearchParams(location.search).forEach((value, key) => {
    params[key] = value;
  });
  new URLSearchParams(hash).forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

function popupFeatures() {
  const width = 480;
  const height = 720;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

  return `width=${width},height=${height},left=${left},top=${top}`;
}

/**
 * 팝업을 열고 콜백 결과를 기다린다.
 *
 * ⚠️ **사용자가 버튼을 누른 그 호출 안에서 await 없이 불러야 한다.** 한 번이라도 await를 지나면
 * 브라우저(특히 모바일 사파리)가 사용자 동작으로 보지 않아 팝업을 막는다.
 *
 * 사용자가 팝업을 그냥 닫으면 `CANCELLED`로 끝낸다(버튼 쪽이 조용히 넘긴다). 다만 COOP 때문에
 * 팝업이 열려 있어도 `closed`가 true로 보일 수 있어, **원래 창이 다시 앞에 왔을 때만** 닫힘으로 친다.
 */
export function openOAuthPopup(
  provider: OAuthProvider,
  authorizeUrl: string,
  state: string
): Promise<Record<string, string>> {
  const popup = window.open(authorizeUrl, `showroomz-oauth-${provider}`, popupFeatures());

  if (!popup) {
    return Promise.reject(new Error("팝업이 차단됐어요. 브라우저에서 이 사이트의 팝업을 허용해 주세요"));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let closedSince: number | null = null;
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(OAUTH_CHANNEL);

    const cleanup = () => {
      settled = true;
      channel?.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(closeWatcher);
    };

    const handleMessage = (message: OAuthCallbackMessage | null) => {
      if (settled || !message || message.provider !== provider || message.state !== state) {
        return;
      }
      cleanup();

      const { error, error_description: description } = message.params;

      if (error) {
        // 동의 화면에서 「취소」 — 실패가 아니다
        reject(
          new Error(
            error === "access_denied" ? "CANCELLED" : `${error}${description ? `: ${description}` : ""}`
          )
        );
        return;
      }
      resolve(message.params);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== OAUTH_STORAGE_KEY || !event.newValue) {
        return;
      }
      try {
        handleMessage(JSON.parse(event.newValue) as OAuthCallbackMessage);
      } catch {
        // 다른 탭이 남긴 깨진 값 — 무시
      }
    };

    if (channel) {
      channel.onmessage = event => handleMessage(event.data as OAuthCallbackMessage);
    }
    window.addEventListener("storage", handleStorage);

    const closeWatcher = setInterval(() => {
      const isBackHere = document.visibilityState === "visible" && document.hasFocus();

      if (!popup.closed || !isBackHere) {
        closedSince = null;
        return;
      }
      closedSince ??= Date.now();
      // 콜백 페이지가 결과를 보내고 닫히는 사이의 틈 — 메시지가 늦게 올 수 있어 잠깐 기다린다
      if (Date.now() - closedSince > 1500) {
        cleanup();
        reject(new Error("CANCELLED"));
      }
    }, 500);
  });
}
