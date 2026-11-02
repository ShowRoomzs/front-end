import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { MOTION_REDUCE } from "@/common/constants/motion";

/**
 * 목록 행 — 디자인 시스템 §08 누름: 행은 투명도 대신 배경 #F7F7F8을 깐다.
 *
 * 손가락이 닿는 순간(0ms) 깔리고 손을 떼면 120ms로 걷힌다. 글자를 흐리게 하지 않으므로
 * 행 전체가 눌렸다는 것이 읽힌다. 비활성 행은 반응하지 않는다.
 */
interface PressableRowProps {
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const PRESSED_BACKGROUND = "#F7F7F8";
const RELEASE_DURATION = 120;

export default function PressableRow(props: PressableRowProps) {
  const { onPress, disabled, className, style, children } = props;
  const pressed = useSharedValue(0);

  const backgroundStyle = useAnimatedStyle(() => ({ opacity: pressed.value }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: RELEASE_DURATION, reduceMotion: MOTION_REDUCE });
      }}
      className={className}
      style={style}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: PRESSED_BACKGROUND }, backgroundStyle]}
      />
      {children}
    </Pressable>
  );
}
