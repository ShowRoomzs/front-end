import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { OPACITY_VALUE } from "@/common/components/Dots/config";

interface DotProps {
  index: number;
  progress: SharedValue<number>;
  itemCount: number;
}

export default function Dot(props: DotProps) {
  const { index, progress, itemCount } = props;

  const animatedStyle = useAnimatedStyle(() => {
    if (index === 0 && progress.value >= itemCount - 1) {
      const opacity = interpolate(progress.value, [itemCount - 1, itemCount], [OPACITY_VALUE, 1], "clamp");

      return { opacity };
    }
    const opacity = interpolate(
      progress.value,
      [index - 0.5, index, index + 0.5],
      [OPACITY_VALUE, 1, OPACITY_VALUE],
      "clamp"
    );

    return { opacity };
  });

  return <Animated.View style={animatedStyle} className="w-6 h-6 bg-black rounded-full" />;
}
