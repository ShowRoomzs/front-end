import { ReactNode } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useOverlay } from "@/common/providers/OverlayProvider";

interface OverlayLayoutProps {
  children: ReactNode;
}

export default function OverlayLayout(props: OverlayLayoutProps) {
  const { children } = props;
  const { scale } = useOverlay();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1 overflow-hidden rounded-3xl">
      {children}
    </Animated.View>
  );
}
