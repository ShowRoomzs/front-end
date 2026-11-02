import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import { MOTION_DURATION, MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/**
 * 펼침 셰브런 — 열리면 180° 돈다(§08 아코디언 · 드롭다운).
 *
 * 펼칠 때 200ms standard, 접을 때는 내용과 같이 150ms exit로 돌아온다.
 */
interface ExpandChevronProps {
  expanded: boolean;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ExpandChevron(props: ExpandChevronProps) {
  const { expanded, size = 14, color = "#C7C7C7", style } = props;
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 180 : 0, {
      duration: expanded ? MOTION_DURATION.base : MOTION_DURATION.collapse,
      easing: expanded ? MOTION_EASING.standard : MOTION_EASING.exit,
      reduceMotion: MOTION_REDUCE,
    });
  }, [expanded, rotation]);

  const rotateStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View style={[style, rotateStyle]}>
      <ChevronDownIcon size={size} color={color} />
    </Animated.View>
  );
}
