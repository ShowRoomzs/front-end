import { PermissionsAndroid, Platform } from "react-native";

/**
 * 안드로이드 13+ 알림 권한 창 — FCM의 requestPermission은 안드로이드에서 창을 띄우지 않아 직접 묻는다.
 * 12 이하는 설치할 때 이미 허용돼 있어 묻지 않는다(null = 묻지 않음 · 현재 상태를 따로 읽을 것)
 */
export async function requestAndroidNotificationPermission() {
  if (Number(Platform.Version) < 33) {
    return null;
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  return result === PermissionsAndroid.RESULTS.GRANTED;
}
