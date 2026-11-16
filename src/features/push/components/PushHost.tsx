import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { navigationRef } from "@/common/router/navigationRef";
import { useUserStore } from "@/common/stores/useUserStore";
import { invalidateAccountStatus } from "@/features/account/hooks/useAccountStatus";
import { HOME_SUMMARY_QUERY_KEY } from "@/features/home/hooks/useHomeSummary";
import { NOTIFICATION_QUERY_KEY } from "@/features/notification/constants/queryKey";
import { notificationService } from "@/features/notification/services/notificationService";
import { openNotificationTarget } from "@/features/notification/utils/openNotificationTarget";
import {
  getPushToken,
  onForegroundPush,
  onPushOpened,
  onPushTokenRefresh,
  PushData,
  requestPushPermission,
} from "@/features/push/lib/pushMessaging";
import { pushService } from "@/features/push/services/pushService";

/** 알림 권한은 설치당 한 번만 먼저 묻는다 — 거절한 사람에게 매번 창을 띄우지 않는다(이후엔 C11 [설정 열기]) */
const PERMISSION_ASKED_KEY = "push.permissionAsked";

/** 차가운 시작(알림을 눌러 앱이 켜짐)에서 내비게이션이 준비되길 기다리는 한도 */
const NAVIGATION_WAIT_MS = 10_000;

/**
 * 서버 푸시 `data` 모양(값은 전부 문자열) — 백엔드 PushMessage 생성처 3곳
 *
 * - `type: NOTIFICATION` — 알림함(C11)과 같은 알림. `notificationId` · `targetType` · `targetId` · `targetSub`
 *   (`NotificationPushDispatcher.data`). 주문 대상은 하위주문 id만 와서 주문 내역으로 연다.
 * - `type: ACCOUNT_STATUS` — 계정 이용 정지 · 해제(`UserSanctionNotifier`). 상태를 다시 읽으면 AccountStatusHost가 안내한다.
 * - 그 밖의 `type` + `postId` — 게시물 알림(`PostPushMessageFactory`). 팔로워 새 게시물(`PUBLISHED_TO_FOLLOWERS`)과
 *   크리에이터 본인 게시물 처리 결과. 삭제된 게시물(`DELETED_*`)은 열 화면이 없다.
 */
function openPush(data: PushData) {
  if (data.type === "ACCOUNT_STATUS") {
    invalidateAccountStatus();
    return;
  }
  if (data.type === "NOTIFICATION") {
    const notificationId = Number(data.notificationId);

    if (notificationId && useUserStore.getState().user) {
      void notificationService.markRead(notificationId).catch(() => undefined);
    }
    if (data.targetType === "ACCOUNT_STATUS") {
      invalidateAccountStatus();
      return;
    }
    openNotificationTarget({
      type: data.targetType ?? null,
      id: data.targetId ? Number(data.targetId) : null,
      sub: data.targetSub ?? null,
    });
    return;
  }
  if (data.postId && !data.type?.startsWith("DELETED_")) {
    openNotificationTarget({ type: "POST", id: Number(data.postId), sub: null });
  }
}

/** 알림을 눌러 앱이 켜진 경우 내비게이션이 아직 없다 — 준비될 때까지 기다렸다 연다 */
function openPushWhenReady(data: PushData) {
  const startedAt = Date.now();

  const attempt = () => {
    if (navigationRef.isReady()) {
      openPush(data);
      return;
    }
    if (Date.now() - startedAt < NAVIGATION_WAIT_MS) {
      setTimeout(attempt, 200);
    }
  };

  attempt();
}

async function registerToken(token: string | null) {
  if (token) {
    await pushService.registerDeviceToken(token);
  }
}

/**
 * 푸시의 **화면 밖** 일 — 앱에 하나만 둔다(`App`, 내비게이션 안).
 *
 * - 로그인하면 이 기기 토큰을 계정에 등록하고(`PUT /user/device-token`), 토큰이 바뀌면 다시 등록한다.
 *   알림 권한은 처음 로그인했을 때 한 번 묻는다(시안에 사전 안내 화면이 없어 OS 창을 바로 띄운다).
 * - 앱을 보는 중 도착한 푸시는 배너를 띄우지 않고 종 배지 · 알림 목록만 새로 받는다.
 * - 알림을 누르면 C11 목록과 같은 규칙으로 대상 화면을 연다.
 *
 * 로그아웃 때 토큰 무효화는 useLogin.logout이 한다.
 */
export default function PushHost() {
  const userId = useUserStore(state => state.user?.id);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    const register = async () => {
      try {
        if (!(await AsyncStorage.getItem(PERMISSION_ASKED_KEY))) {
          await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "1");
          await requestPushPermission();
        }
        await registerToken(await getPushToken());
      } catch {
        // 알림을 못 받는 것은 불편이지 장애가 아니다 — 다음 실행 때 다시 등록한다
      }
    };

    void register();
    const unsubscribe = onPushTokenRefresh(token => void registerToken(token).catch(() => undefined));

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    const unsubscribeForeground = onForegroundPush(data => {
      if (data.type === "ACCOUNT_STATUS" || data.targetType === "ACCOUNT_STATUS") {
        invalidateAccountStatus();
      }
      void queryClient.invalidateQueries({ queryKey: [HOME_SUMMARY_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
    });
    const unsubscribeOpened = onPushOpened(openPushWhenReady);

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  return null;
}
