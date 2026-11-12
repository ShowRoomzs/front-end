/**
 * PC 화면 틀 — 넓은 화면에서는 앱을 가운데 **폰 폭 창(iframe)** 안에 띄운다.
 *
 * 앱은 모바일 화면 하나만 설계돼 있고, 여러 화면이 창 폭(useWindowDimensions)으로 이미지 · 캐러셀 크기를
 * 잡는다. CSS로 #root 폭만 줄이면 그 값들은 여전히 PC 창 폭이라 그림이 칸을 넘친다. iframe 안에서는
 * 창 폭이 곧 틀 폭이라 앱 코드를 고치지 않고 폰과 같은 화면이 된다.
 *
 * - 틀 안 앱의 주소 변화는 바깥 주소창에 그대로 옮긴다(공유 · 새로고침이 같은 화면으로 열리게).
 *   브라우저 뒤로가기는 iframe 기록도 함께 쓰므로 따로 손대지 않는다.
 * - 소셜 로그인 팝업 · 결제창은 틀 안에서 그대로 동작한다(같은 출처).
 */
const FRAME_WIDTH = 430;
/** 이보다 좁으면 틀 없이 바로 띄운다 — 폰 · 좁은 창 */
const SHELL_MIN_VIEWPORT = 720;
const URL_MESSAGE = "showroomz:url";

interface UrlMessage {
  type: typeof URL_MESSAGE;
  path: string;
  title: string;
}

/** 틀 안 앱 — 주소가 바뀔 때마다 바깥에 알린다 */
function syncUrlToParent() {
  const post = () => {
    const message: UrlMessage = {
      type: URL_MESSAGE,
      path: window.location.pathname + window.location.search + window.location.hash,
      title: document.title,
    };

    window.parent.postMessage(message, window.location.origin);
  };

  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method];

    window.history[method] = function patched(...args: Parameters<History["pushState"]>) {
      original.apply(this, args);
      post();
    };
  }
  window.addEventListener("popstate", post);
  post();
}

function renderShell() {
  const style = document.createElement("style");

  style.textContent = `
    html, body { height: 100%; margin: 0; }
    body { background: #F2F2F4; display: flex; justify-content: center; overflow: hidden; }
    #showroomz-frame {
      width: ${FRAME_WIDTH}px; height: 100%; border: 0; display: block; background: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 40px rgba(0, 0, 0, 0.08);
    }
  `;
  document.head.appendChild(style);

  const frame = document.createElement("iframe");

  frame.id = "showroomz-frame";
  frame.title = "SHOWROOMZ";
  // 지금 주소 그대로 틀 안에서 연다 — 딥링크(/showroom/8 등)로 들어온 사람도 같은 화면에 닿는다
  frame.src = window.location.pathname + window.location.search + window.location.hash;
  frame.allow = "payment; clipboard-write";

  document.body.replaceChildren(frame);

  window.addEventListener("message", event => {
    const data = event.data as Partial<UrlMessage> | null;

    if (event.origin !== window.location.origin || data?.type !== URL_MESSAGE || !data.path) {
      return;
    }
    window.history.replaceState(null, "", data.path);
    if (data.title) {
      document.title = data.title;
    }
  });
}

/**
 * @returns 틀을 띄웠으면 true — 이 창에서는 앱을 띄우지 않는다(틀 안에서 뜬다)
 */
export function mountDesktopShell(): boolean {
  if (window.self !== window.top) {
    syncUrlToParent();
    return false;
  }
  if (window.innerWidth < SHELL_MIN_VIEWPORT) {
    return false;
  }
  renderShell();
  return true;
}
