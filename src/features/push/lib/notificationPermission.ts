/** 안드로이드 전용 — iOS · 웹에서는 묻지 않는다(구현은 `notificationPermission.android.ts`) */
export async function requestAndroidNotificationPermission(): Promise<boolean | null> {
  return null;
}
