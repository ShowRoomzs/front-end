/**
 * 토큰 저장소 — 앱은 기기 보안 저장소(expo-secure-store)를 그대로 쓴다.
 * 웹은 그 모듈이 없어 `secureStorage.web.ts`가 대신한다. 호출하는 쪽은 플랫폼을 몰라도 된다.
 */
export { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
