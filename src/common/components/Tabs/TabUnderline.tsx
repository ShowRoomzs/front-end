import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { cn } from "@/common/utils/cn";

interface TabUnderlineProps {
  selectedIndex: number;
  itemWidth: number;
  translateX: number;
  underlineClassName?: string;
}

export default function TabUnderline(props: TabUnderlineProps) {
  const { selectedIndex, itemWidth, translateX: targetTranslateX, underlineClassName } = props;
  const translateX = useSharedValue(targetTranslateX);
  const width = useSharedValue(itemWidth);
  const prevSelectedIndex = useRef(selectedIndex);

  useEffect(() => {
    const isIndexChanged = prevSelectedIndex.current !== selectedIndex;

    prevSelectedIndex.current = selectedIndex;

    if (isIndexChanged) {
      // 탭 변경 시: 애니메이션 적용
      translateX.value = withSpring(targetTranslateX, {
        damping: 20,
        stiffness: 200,
      });
      width.value = withSpring(itemWidth, {
        damping: 20,
        stiffness: 200,
      });
    } else {
      // scroll만 변경 시: 즉시 반영
      translateX.value = targetTranslateX;
      width.value = itemWidth;
    }
  }, [selectedIndex, targetTranslateX, itemWidth, translateX, width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: width.value,
    };
  });

  return (
    <View className="w-full h-2 relative">
      <Animated.View
        className={cn("absolute bottom-0 h-2 bg-black", underlineClassName)}
        style={animatedStyle}
      />
    </View>
  );
}
