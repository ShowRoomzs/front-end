import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { cn } from "@/common/utils/cn";

interface TabUnderlineProps {
  selectedIndex: number;
  itemWidth: number;
  underlineClassName?: string;
}

export default function TabUnderline(props: TabUnderlineProps) {
  const { selectedIndex, itemWidth, underlineClassName } = props;
  const translateX = useSharedValue(selectedIndex * itemWidth);

  useEffect(() => {
    translateX.value = withTiming(selectedIndex * itemWidth, { duration: 300 });
  }, [selectedIndex, itemWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="w-full h-2 relative">
      <Animated.View
        className={cn("absolute bottom-0 h-2 bg-black", underlineClassName)}
        style={[{ width: itemWidth }, animatedStyle]}
      />
    </View>
  );
}
