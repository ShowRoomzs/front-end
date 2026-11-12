/**
 * 웹 소셜 로그인 콜백 처리 — 앱(네이티브)에는 콜백 페이지가 없다. 웹 구현은 `oauthCallback.web.ts`.
 *
 * @returns 지금 주소가 콜백 페이지라 처리했으면 true(앱을 띄우지 않는다)
 */
export function handleOAuthCallback(): boolean {
  return false;
}
