/** 쇼룸 핸들 링크 — `/@handle`(끝의 / 는 있어도 된다) */
const HANDLE_PATH = /^\/@([^/]+)\/?$/;

/**
 * 앱이 뜨기 전에 웹 주소를 앱 경로로 옮긴다.
 *
 * 크리에이터가 SNS에 거는 쇼룸 링크는 `m.showroomz.co.kr/@handle`이다(서버 showroomUrl · 옛 `showroomz.co.kr/@handle`은 랜딩이 m.으로 넘긴다). 내비게이션 경로 규칙은
 * 「@」가 붙은 조각을 변수로 받지 못해 `/u/handle`로 바꿔 둔다 — 그 화면이 핸들로 쇼룸을 찾아 쇼룸 화면으로 보낸다.
 * 주소창에는 잠깐 /u/handle 이 보였다가 /showroom/{번호}가 된다.
 */
export function normalizeWebPath() {
  const match = HANDLE_PATH.exec(window.location.pathname);

  if (match) {
    window.history.replaceState(null, "", `/u/${match[1]}${window.location.search}`);
  }
}
