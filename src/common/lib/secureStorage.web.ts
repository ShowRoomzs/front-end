/**
 * 웹 토큰 저장소 — expo-secure-store는 웹 구현이 없어(`getValueWithKeyAsync is not a function`)
 * 앱이 켜지는 순간 세션 복원에서 멈춘다.
 *
 * ⚠️ 1단계 임시: localStorage는 같은 출처의 스크립트가 모두 읽을 수 있다. 웹 로그인(2단계)을 붙일 때
 * 리프레시 토큰을 httpOnly 쿠키로 받는 방식을 서버와 정해 이 파일을 바꾼다.
 */
function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export async function getItemAsync(key: string): Promise<string | null> {
  return storage()?.getItem(key) ?? null;
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  storage()?.setItem(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  storage()?.removeItem(key);
}
