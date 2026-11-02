import { ReactNode, useEffect, useState } from "react";
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { MOTION_DURATION, MOTION_REDUCE } from "@/common/constants/motion";

/**
 * 스켈레톤 — 로딩 대기(디자인 시스템 §07 · §08).
 *
 * 스피너 대신 **그 화면이 채울 레이아웃 그대로**를 회색 블록으로 그려, 무엇이 몇 개 올지
 * 미리 알려 로드 뒤의 점프를 줄인다. 블록은 화면마다 `SkeletonBlock`으로 짠다.
 *
 * - 300ms 안에 끝나는 대기에는 아예 띄우지 않는다(깜빡임 방지) — 그동안은 빈 자리다.
 * - 투명도 1 ↔ .55를 1.4s 주기로 되풀이한다. 블록마다 따로 돌리지 않고 묶음 전체가 함께 숨쉰다.
 * - 로드가 끝나 내려갈 때는 200ms로 흐려지며 콘텐츠에 자리를 넘긴다.
 *
 * 첫 진입 · 다음 페이지에 쓰고, 텍스트 한 줄 갱신 같은 작은 대기에는 쓰지 않는다.
 */
interface SkeletonProps {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const SHOW_DELAY = 300;
const PULSE_HALF = 700;
const PULSE_MIN_OPACITY = 0.55;

export default function Skeleton(props: SkeletonProps) {
  const { children, className, style } = props;
  const [visible, setVisible] = useState(false);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    opacity.value = withRepeat(
      withTiming(PULSE_MIN_OPACITY, {
        duration: PULSE_HALF,
        easing: Easing.inOut(Easing.ease),
        reduceMotion: MOTION_REDUCE,
      }),
      -1,
      true,
      undefined,
      MOTION_REDUCE
    );
  }, [opacity, visible]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      exiting={FadeOut.duration(MOTION_DURATION.base).reduceMotion(MOTION_REDUCE)}
      className={className}
      style={style}
    >
      <Animated.View style={pulseStyle}>{children}</Animated.View>
    </Animated.View>
  );
}

interface SkeletonBlockProps {
  width?: DimensionValue;
  /** 비우면 style의 aspectRatio 등으로 정한다 */
  height?: DimensionValue;
  /** 기본 R4. 아바타는 원(높이의 절반) */
  radius?: number;
  /** 보조 블록 #F2F2F4 — 두 번째 줄 · 아이디처럼 덜 중요한 자리 */
  sub?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBlock(props: SkeletonBlockProps) {
  const { width = "100%", height, radius = 4, sub = false, style } = props;

  return (
    <View
      className={sub ? "bg-skeletonSub" : "bg-skeleton"}
      style={[{ width, height, borderRadius: radius }, style]}
    />
  );
}

/**
 * 콘텐츠 위에 겹치는 스켈레톤 — 흰 바탕째 그려 아래를 가리고, 내려갈 때 바탕째 흐려져
 * 막 그려진 콘텐츠와 200ms 크로스페이드가 된다.
 *
 * 로딩 분기와 콘텐츠 분기를 갈아 끼우면 스켈레톤이 부모째 사라져 퇴장 애니메이션이 돌지 않는다
 * (목록의 빈 상태 자리도 마찬가지). 그래서 콘텐츠와 **같은 부모 안에 형제로** 두고 `visible`만 내린다.
 * `top`으로 머리말처럼 가리지 않을 높이를 비운다.
 */
export function SkeletonOverlay(props: { visible: boolean; top?: number; children: ReactNode }) {
  const { visible, top = 0, children } = props;

  if (!visible) {
    return null;
  }

  return <Skeleton style={[overlayStyles.overlay, { top }]}>{children}</Skeleton>;
}

const overlayStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFFFFF", overflow: "hidden" },
});

/** 같은 자리 표시를 n번 되풀이한다 — 목록 첫 진입 */
export function SkeletonRepeat(props: { count: number; children: ReactNode }) {
  const { count, children } = props;

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <View key={index}>{children}</View>
      ))}
    </>
  );
}
