import {
  AuthorizationStatus,
  deleteToken,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";

import { requestAndroidNotificationPermission } from "@/features/push/lib/notificationPermission";

/**
 * FCM(@react-native-firebase/messaging)을 감싼 앱 전용 창구 — 화면 코드는 이 파일만 쓴다.
 * 웹에는 FCM 네이티브 모듈이 없어 같은 이름의 빈 구현(`pushMessaging.web.ts`)이 대신 붙는다.
 *
 * 서버는 iOS도 APNs 토큰이 아니라 **FCM 토큰**을 받는다(`DeviceTokenRequest`) — 그래서 iOS도 FCM SDK로 토큰을 받는다.
 * Firebase 콘솔에 APNs 인증키가 올라가 있어야 iOS로 실제 발송된다(11-16 등록).
 */

/** 푸시 데이터 — 서버 `PushMessage.data`(값은 전부 문자열) */
export type PushData = Record<string, string>;

/**
 * 네이티브 FCM 모듈이 없는 빌드(이 기능 전에 만든 dev client · APK)에서는 getMessaging()이 예외를 던진다.
 * 그때는 푸시만 조용히 꺼지고 앱은 그대로 돌아야 한다 — 모든 진입점이 이 값을 먼저 본다
 */
function messagingOrNull() {
  try {
    return getMessaging();
  } catch {
    return null;
  }
}

const noop = () => undefined;

function isGranted(status: number) {
  return status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
}

/** 기기 알림이 켜져 있는지 — 안드로이드는 앱 알림 스위치, iOS는 알림 권한 */
export async function hasPushPermission() {
  const messaging = messagingOrNull();

  return messaging ? isGranted(await hasPermission(messaging)) : true;
}

/**
 * 알림 권한을 묻는다 — 이미 답했으면 OS가 창을 다시 띄우지 않고 현재 상태만 돌려준다.
 * 안드로이드 13+는 POST_NOTIFICATIONS를 직접 물어야 창이 뜬다(FCM의 requestPermission은 안드로이드에서 묻지 않는다).
 */
export async function requestPushPermission() {
  if (Platform.OS === "android") {
    return (await requestAndroidNotificationPermission()) ?? hasPushPermission();
  }
  const messaging = messagingOrNull();

  return messaging ? isGranted(await requestPermission(messaging)) : false;
}

/** 이 기기의 FCM 토큰 — 권한과 상관없이 받을 수 있다(권한이 없으면 서버가 보내도 기기가 띄우지 않을 뿐) */
export async function getPushToken() {
  const messaging = messagingOrNull();

  return messaging ? getToken(messaging) : null;
}

/** 토큰이 바뀌면 다시 등록해야 한다 — 앱 재설치 · 데이터 삭제 · FCM 갱신 */
export function onPushTokenRefresh(listener: (token: string) => void) {
  const messaging = messagingOrNull();

  return messaging ? onTokenRefresh(messaging, listener) : noop;
}

/**
 * 로그아웃 · 탈퇴 — 이 기기 토큰을 FCM에서 무효로 만든다. 서버가 다음 발송 때 무효 토큰을 지운다(`purgeInvalid`).
 * 다음 로그인 때는 새 토큰이 나와 새 계정으로 등록된다 — 지난 계정의 알림이 이 기기로 오지 않는다.
 */
export async function deletePushToken() {
  const messaging = messagingOrNull();

  if (messaging) {
    await deleteToken(messaging);
  }
}

/** 앱을 보고 있는 동안 도착한 푸시 — OS가 배너를 띄우지 않는다(안드로이드 · iOS 모두 기본값) */
export function onForegroundPush(listener: (data: PushData) => void) {
  const messaging = messagingOrNull();

  return messaging ? onMessage(messaging, message => listener((message.data ?? {}) as PushData)) : noop;
}

/**
 * 알림을 눌러 앱이 열렸을 때 — 백그라운드에서 돌아온 경우(리스너)와 꺼진 상태에서 켜진 경우(첫 알림) 둘 다 받는다
 */
export function onPushOpened(listener: (data: PushData) => void) {
  const messaging = messagingOrNull();

  if (!messaging) {
    return noop;
  }
  const unsubscribe = onNotificationOpenedApp(messaging, message =>
    listener((message.data ?? {}) as PushData)
  );

  void getInitialNotification(messaging).then(message => {
    if (message) {
      listener((message.data ?? {}) as PushData);
    }
  });
  return unsubscribe;
}

/**
 * 백그라운드 수신 처리기 — 등록하지 않으면 FCM이 경고를 남긴다. 알림 표시는 OS가 하므로 할 일은 없다.
 * 앱 진입점(index.ts)에서 컴포넌트 등록 전에 불러야 한다
 */
export function registerBackgroundPushHandler() {
  const messaging = messagingOrNull();

  if (messaging) {
    setBackgroundMessageHandler(messaging, async () => undefined);
  }
}
