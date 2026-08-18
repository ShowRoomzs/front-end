import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/common/utils/cn";

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
  style?: ViewStyle;
}

export default function Spinner(props: SpinnerProps) {
  const { size = 24, color = "#0F0F0F", className, style } = props;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      style={[{ width: size, height: size }, style]}
      className={cn("items-center justify-center", className)}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: size / 8,
            borderColor: "transparent",
            borderTopColor: color,
            borderRightColor: color,
          },
        ]}
      />
    </View>
  );
}
