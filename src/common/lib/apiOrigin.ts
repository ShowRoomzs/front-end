/**
 * API 서버 주소(경로 앞부분). axios 인스턴스(api · auth · refresh · 가입 본인인증)가 모두 이 값을 쓴다.
 *
 * - 앱 · 로컬 웹: `EXPO_PUBLIC_PROTOCOL://EXPO_PUBLIC_API_HOST`(예: https://api.showroomz.co.kr)
 * - 배포 웹(Vercel): vercel.json 빌드 명령이 `EXPO_PUBLIC_API_ORIGIN=`(빈 값)을 준다 → 같은 주소의 `/v1`을 부르고
 *   Vercel이 API 서버로 넘긴다(vercel.json rewrites).
 *   웹 리프레시 토큰은 httpOnly 쿠키라, API를 다른 사이트(api.showroomz.co.kr)로 부르면 브라우저가 쿠키를 붙이지 않는다
 *   (SameSite=Lax · 사파리는 다른 사이트 쿠키 차단). 같은 주소로 부르면 그 주소의 쿠키가 되어 붙는다.
 */
export const API_ORIGIN =
  process.env.EXPO_PUBLIC_API_ORIGIN ??
  `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}`;
