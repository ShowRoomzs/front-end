/**
 * 데모 모드 — 창업지원단 미팅용 TestFlight 빌드에서만 켠다.
 *
 * 켜지면 앱이 **서버를 전혀 부르지 않는다.** 모든 서비스가 `src/demo/services`의 구현으로
 * 갈아 끼워지고, 팔로우·좋아요·장바구니는 메모리에만 쌓인다(앱을 껐다 켜면 초기 상태로 돌아온다 —
 * 데모를 여러 번 반복할 때 오히려 유리하다).
 *
 * 꺼져 있으면 **코드 경로가 하나도 바뀌지 않는다.** 각 서비스가 `IS_DEMO`로 한 번 분기할 뿐이라
 * 운영 빌드는 지금까지와 동일하게 동작한다.
 *
 * `FORCE_DEMO`를 함께 두는 이유는, EAS 빌드 프로필의 환경변수가 번들에 실리지 않는 사고가
 * 실제로 있기 때문이다. 빌드 직전에 이 값을 true로 바꾸면 환경변수와 무관하게 데모로 돈다.
 *
 * **데모가 끝나면** `src/demo/` 폴더와 각 서비스의 `IS_DEMO` 분기, `eas.json`의 demo 프로필을
 * 지우면 흔적이 남지 않는다.
 */
/**
 * ⚠️ 지금 **켜져 있다**(미팅용). 이 값이 true인 동안에는 어떤 프로필로 빌드해도 데모로 돈다.
 * 운영 빌드를 내보내기 전에 반드시 false로 되돌릴 것.
 */
const FORCE_DEMO = true;

export const IS_DEMO = FORCE_DEMO || process.env.EXPO_PUBLIC_DEMO_MODE === "true";

/** 데모 응답에 넣는 지연 — 0이면 화면이 깜빡임 없이 즉시 그려져 오히려 가짜처럼 보인다 */
export const DEMO_LATENCY_MS = 180;

export function demoDelay<T>(value: T, ms = DEMO_LATENCY_MS): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}
