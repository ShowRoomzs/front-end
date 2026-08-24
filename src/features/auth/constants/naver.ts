/**
 * 네이버 로그인이 끝난 뒤 앱으로 돌아오는 데 쓰는 iOS URL Scheme.
 *
 * 관례상 `naver{clientId}`를 쓰지만 우리 clientId에는 밑줄(`_`)이 들어 있어 그럴 수 없다.
 * Apple은 URL Scheme에 영숫자·점·하이픈·플러스만 허용하므로(RFC1738) 밑줄이 섞이면
 * App Store Connect 업로드가 ITMS-90158로 거부된다. 그래서 clientId와 무연한 고정값을 쓴다.
 *
 * 이 값은 세 곳이 **모두** 같아야 로그인이 성립한다:
 *   1. 여기 (SDK initialize의 serviceUrlSchemeIOS — useNaverLogin.ts)
 *   2. app.config.ts의 @react-native-seoul/naver-login 플러그인 urlScheme (→ Info.plist)
 *   3. 네이버 개발자센터 → 애플리케이션 → iOS 설정의 URL Scheme
 * 바꿀 일이 생기면 3번을 잊지 말 것. 앱만 고치면 인증 후 복귀가 조용히 실패한다.
 */
export const NAVER_URL_SCHEME = "showroomznaver";
