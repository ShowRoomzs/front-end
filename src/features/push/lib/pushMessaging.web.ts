/**
 * 웹 — FCM 네이티브 모듈이 없다. 웹 푸시는 아직 하지 않는다(웹 앱 등록 · VAPID 키가 필요, 나중에).
 * 네이티브 구현(`pushMessaging.ts`)과 같은 이름 · 모양을 두어 화면 코드가 플랫폼을 가르지 않게 한다.
 */
export type PushData = Record<string, string>;

const noop = () => undefined;

export async function hasPushPermission() {
  return true; // 웹은 「기기 알림 꺼짐」 안내를 띄우지 않는다
}

export async function requestPushPermission() {
  return false;
}

export async function getPushToken(): Promise<string | null> {
  return null;
}

export function onPushTokenRefresh(_listener: (token: string) => void) {
  return noop;
}

export async function deletePushToken() {
  return undefined;
}

export function onForegroundPush(_listener: (data: PushData) => void) {
  return noop;
}

export function onPushOpened(_listener: (data: PushData) => void) {
  return noop;
}

export function registerBackgroundPushHandler() {
  return undefined;
}
