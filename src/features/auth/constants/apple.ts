/**
 * 웹 애플 로그인의 Services ID — 애플 개발자 계정에서 11-12에 만든 값(사용자).
 *
 * 앱은 번들 ID(`com.showroomz.app`)로 로그인하고, 웹은 이 값으로 로그인한다. 그래서 웹에서 받은
 * id_token의 aud는 이 값이다 — 서버가 aud를 검증할 때 두 값을 모두 허용해야 한다(백엔드 요청 전달함).
 * Domains `showroomz.co.kr` · Return URL `https://showroomz.co.kr/auth/apple/callback`이 등록돼 있다.
 * 애플은 localhost를 받지 않아 실제 주소에서만 동작한다.
 */
export const APPLE_WEB_SERVICE_ID = "com.showroomz.web";
