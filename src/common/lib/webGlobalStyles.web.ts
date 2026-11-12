/**
 * 웹 전용 전역 CSS — react-native-web이 스타일로 표현하지 못하는 브라우저 기본 동작만 바로잡는다.
 *
 * - **한글 줄바꿈:** 브라우저 기본(word-break: normal)은 한글을 글자 단위로 끊어 「있어/요」처럼
 *   단어 중간에서 줄이 바뀐다. 앱(iOS · 안드로이드)은 어절 단위로 끊으므로 keep-all로 맞춘다.
 *   공백 없이 긴 영문 · 숫자는 그래도 칸을 넘지 않게 overflow-wrap으로 끊는다.
 * - **입력칸 포커스 테두리:** 브라우저가 입력칸에 검은 외곽선을 그린다. 앱 입력칸은 자체 테두리 색으로
 *   포커스를 보여 주므로 기본 외곽선은 지운다.
 */
const CSS = `
body { word-break: keep-all; overflow-wrap: anywhere; }
input:focus, textarea:focus { outline: none; }
`;

export function applyWebGlobalStyles() {
  if (document.getElementById("showroomz-web-global")) {
    return;
  }
  const style = document.createElement("style");

  style.id = "showroomz-web-global";
  style.textContent = CSS;
  document.head.appendChild(style);
}
