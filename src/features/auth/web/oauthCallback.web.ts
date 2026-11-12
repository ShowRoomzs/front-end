import {
  matchCallbackPath,
  OAUTH_CHANNEL,
  OAUTH_STORAGE_KEY,
  OAuthCallbackMessage,
  readCallbackParams,
} from "@/features/auth/web/oauthPopup";

/**
 * `/auth/{kakao|naver|google}/callback` — 소셜 로그인 팝업이 돌아오는 페이지.
 *
 * 앱을 띄우지 않고 결과(인가 코드 · 토큰 · 오류)를 원래 창에 보낸 뒤 팝업을 닫는다.
 * 원래 창이 state를 확인해 자기 요청의 응답일 때만 받는다(`oauthPopup.ts`).
 *
 * 토큰은 이 페이지 주소(해시)에 잠깐 실려 있으므로 보낸 즉시 주소에서 지운다 — 창이 안 닫히는
 * 브라우저에서 방문 기록에 토큰이 남지 않게 하려는 것이다.
 *
 * @returns 콜백 페이지라 처리했으면 true — index.ts가 앱을 등록하지 않는다
 */
export function handleOAuthCallback(): boolean {
  const provider = matchCallbackPath(window.location.pathname);

  if (!provider) {
    return false;
  }

  const params = readCallbackParams(window.location);
  const message: OAuthCallbackMessage = { provider, state: params.state ?? "", params };

  window.history.replaceState(null, "", window.location.pathname);

  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(OAUTH_CHANNEL);

      channel.postMessage(message);
      channel.close();
    }
  } catch {
    // 아래 storage 경로로 전달된다
  }

  try {
    // BroadcastChannel이 없는 브라우저용 — 다른 창에 storage 이벤트가 간다. 값은 바로 지운다
    window.localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(message));
    window.localStorage.removeItem(OAUTH_STORAGE_KEY);
  } catch {
    // 저장소가 막힌 브라우저(사생활 보호 모드 등) — BroadcastChannel로 이미 보냈다
  }

  document.title = "SHOWROOMZ 로그인";
  document.body.style.cssText =
    "margin:0;display:flex;align-items:center;justify-content:center;height:100vh;" +
    "font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#555;font-size:15px;";
  document.body.textContent = "로그인을 마쳤어요. 이 창을 닫고 쇼룸즈로 돌아가 주세요.";

  window.close();

  return true;
}
