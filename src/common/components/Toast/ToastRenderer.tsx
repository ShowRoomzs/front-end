import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import { CheckIcon, InfoIcon } from "@/common/components/DsIcon/icons";
import { DISMISS_DISTANCE, TOAST_GAP, VELOCITY_THRESHOLD } from "@/common/components/Toast/config";
import Typography from "@/common/components/Typography/Typography";
import { MOTION_DURATION, MOTION_EASING } from "@/common/constants/motion";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useToast, useToastState } from "@/common/providers/ToastProvider/context";
import { navigationRef } from "@/common/router/navigationRef";
import { ROOT_ROUTES } from "@/common/router/routes";

const ROSE_ON_INK = "#FF9DB5";

/** 시안 C7 · C8 · C13 토스트 — 좌우 14 · 그림자 0 6 20 rgba(0,0,0,.18) */
const TOAST_SURFACE_STYLE = {
  gap: 10,
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 10,
  elevation: 8,
} as const;

/**
 * 지금 하단 탭바가 떠 있는지 — 탭바는 홈 탭 묶음의 **각 탭 루트**에서만 그린다(BottomTabs와 같은 판단).
 * 토스트는 내비게이터 밖에 있어 네비게이션 상태를 전역 ref로 읽는다.
 */
function isOnTabRoot() {
  if (!navigationRef.isReady()) {
    return false;
  }
  const root = navigationRef.getRootState();
  const rootRoute = root.routes[root.index];

  if (rootRoute.name !== ROOT_ROUTES.HOME) {
    return false;
  }
  const tabState = rootRoute.state;

  if (!tabState || tabState.index === undefined) {
    return true;
  }

  return (tabState.routes[tabState.index].state?.index ?? 0) === 0;
}

/**
 * 디자인 시스템 §07 토스트 — 잉크 배경 · 흰 글씨 13/500 · R8 · 맨 아래 고정 영역(하단 버튼 바 · 탭바) 위 16.
 * 왼쪽 상태 아이콘(성공 = 흰 체크 / 알림 = 로즈 라인), 오른쪽 로즈 액션은 하나까지.
 */
export default function ToastRenderer() {
  const { top, bottom } = useSafeAreaInsets();
  const { currentToast, opacity, translateY, anchorHeight } = useToastState();
  const { hide, pauseTimer, resumeTimer } = useToast();
  const { isVisible: isTabBarVisible } = useBottomTab();
  const dragY = useSharedValue(0);

  const position = currentToast?.position ?? "bottom";

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value + dragY.value }],
  }));

  // 밀어서 닫기 — 토스트가 붙은 가장자리 쪽으로 밀면 닫히고, 덜 밀면 제자리로 돌아와 남은 시간을 이어 간다
  const pan = useMemo(() => {
    const direction = position === "bottom" ? 1 : -1;

    return Gesture.Pan()
      .onBegin(() => {
        dragY.value = 0;
        runOnJS(pauseTimer)();
      })
      .onUpdate(e => {
        const toward = e.translationY * direction;

        dragY.value = toward > 0 ? e.translationY : e.translationY * 0.2;
      })
      .onEnd(e => {
        const toward = e.translationY * direction;

        if (toward > DISMISS_DISTANCE || e.velocityY * direction > VELOCITY_THRESHOLD) {
          runOnJS(hide)();
          return;
        }
        dragY.value = withTiming(0, { duration: MOTION_DURATION.base, easing: MOTION_EASING.standard });
        runOnJS(resumeTimer)();
      });
  }, [dragY, hide, pauseTimer, position, resumeTimer]);

  if (!currentToast) {
    return null;
  }

  const { message, type = "info", action } = currentToast;
  const isSuccess = type === "success";

  // 맨 아래 고정 영역 위 16 — 하단 버튼 바(안전 영역 포함 높이) · 탭바 · 안전 영역 순으로 그 위에 띄운다
  const tabBarHeight = isTabBarVisible && isOnTabRoot() ? BOTTOM_TABS_HEIGHT : 0;
  const bottomEdge = anchorHeight ?? bottom + tabBarHeight;
  const edgeStyle = position === "bottom" ? { bottom: bottomEdge + TOAST_GAP } : { top: top + TOAST_GAP };

  const handlePressAction = () => {
    action?.onPress();
    hide();
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[edgeStyle, animatedStyle]}
        pointerEvents="box-none"
        className="absolute left-14 right-14 z-[9999]"
      >
        <View
          accessibilityRole="alert"
          className="flex-row items-center rounded-[8px] bg-ink px-15 py-13"
          style={TOAST_SURFACE_STYLE}
        >
          {isSuccess ? (
            <CheckIcon size={18} color="#FFFFFF" thickness={2.2} />
          ) : (
            <InfoIcon size={18} color={ROSE_ON_INK} />
          )}
          <View className="min-w-0 flex-1">
            {typeof message === "string" ? (
              <Typography className="text-13 font-medium leading-[18px] text-white">{message}</Typography>
            ) : (
              message
            )}
          </View>
          {action && (
            <Pressable onPress={handlePressAction} hitSlop={12} accessibilityRole="button">
              <Typography className="text-[12.5px] font-semibold text-roseOnInk">{action.label}</Typography>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
