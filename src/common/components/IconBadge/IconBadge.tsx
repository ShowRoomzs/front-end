import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Typography from "@/common/components/Typography/Typography";
import { MOTION_DURATION, MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/**
 * 헤더 아이콘 모서리 배지 — 장바구니 숫자 · 알림 점.
 *
 * 로즈를 쓰는 몇 안 되는 자리다. 아이콘을 감싼 터치 영역(사방 9px) 기준으로 얹으므로
 * 기본 inset 6이면 아이콘 위 · 오른쪽으로 3px만 삐져나온다.
 *
 * 디자인 시스템 §08 배지
 * - 숫자: 늘어날 때 숫자 변경과 함께 1 → 1.3 → 1 300ms spring(장바구니 담기 성공).
 *   화면에 처음 그릴 때와 줄어들 때는 튀지 않는다 — 담은 순간에만 주는 신호다.
 * - 점: 처음 나타날 때만 scale 0 → 1 200ms.
 */
const BADGE_INSET = 6;
const COUNT_MAX = 99;

/** 300ms를 1.3 · 1 두 구간으로(40% · 60%) */
const BUMP_STEPS = [
  { scale: 1.3, duration: 120 },
  { scale: 1, duration: 180 },
];

interface CountBadgeProps {
  /** 0 이하면 그리지 않는다 — 0을 표기하면 비어 있다는 사실이 알림처럼 보인다 */
  count: number;
  inset?: number;
}

export function CountBadge(props: CountBadgeProps) {
  const { count, inset = BADGE_INSET } = props;
  const scale = useSharedValue(1);
  const prevCountRef = useRef(count);

  useEffect(() => {
    const isIncreased = count > prevCountRef.current;

    prevCountRef.current = count;
    if (!isIncreased) {
      return;
    }
    scale.value = withSequence(
      ...BUMP_STEPS.map(step =>
        withTiming(step.scale, {
          duration: step.duration,
          easing: MOTION_EASING.spring,
          reduceMotion: MOTION_REDUCE,
        })
      )
    );
  }, [count, scale]);

  const bumpStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (count <= 0) {
    return null;
  }

  return (
    <Animated.View
      className="absolute flex-row items-center justify-center rounded-full border-[1.5px] border-white bg-rose"
      style={[{ top: inset, right: inset, minWidth: 18, height: 18, paddingHorizontal: 3 }, bumpStyle]}
    >
      <Typography style={{ fontSize: 10, lineHeight: 10 }} className="text-white">
        {Math.min(count, COUNT_MAX)}
      </Typography>
    </Animated.View>
  );
}

interface DotBadgeProps {
  visible: boolean;
  inset?: number;
}

export function DotBadge(props: DotBadgeProps) {
  const { visible, inset = BADGE_INSET } = props;
  const scale = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    scale.value = visible
      ? withTiming(1, {
          duration: MOTION_DURATION.base,
          easing: MOTION_EASING.standard,
          reduceMotion: MOTION_REDUCE,
        })
      : 0;
  }, [scale, visible]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      className="absolute rounded-full border-[1.5px] border-white bg-rose"
      style={[{ top: inset, right: inset, width: 7, height: 7 }, popStyle]}
    />
  );
}
