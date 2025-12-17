import { ReactNode } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useOverlay } from "@/common/providers/OverlayProvider";

interface SceneLayoutProps {
  children: ReactNode;
}

export default function OverlayLayout(props: SceneLayoutProps) {
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
