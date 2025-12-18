import { ReactNode } from "react";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface OverlayLayoutProps {
  children: ReactNode;
  scale: SharedValue<number>;
}

export default function OverlayLayout(props: OverlayLayoutProps) {
  const { children, scale } = props;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1 overflow-hidden rounded-3xl">
      {children}
    </Animated.View>
  );
}
