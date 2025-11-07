import { PropsWithChildren } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  clamp,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { DEFAULT_ANIMATION_DURATION } from "./config";

import { usePrevious } from "@/common/hooks/usePrevious";

interface TabItemProps extends PropsWithChildren {
  index: number;
  selectedIndex: number;
  translationX: SharedValue<number>;
  isSwiping: SharedValue<boolean>;
  skipIntermediateTabs: boolean;
}

export default function TabItem(props: TabItemProps) {
  const {
    index,
    selectedIndex,
    translationX: externalTranslationX,
    isSwiping,
    skipIntermediateTabs,
    children,
  } = props;
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const translationX = useSharedValue(0);
  const prevSelectedIndex = usePrevious(selectedIndex);

  const getDefaultTranslationX = (
    externalTranslation: number,
    index: number,
    screenWidth: number
  ): number => {
    "worklet";

    return externalTranslation + index * screenWidth;
  };

  const getClampedTranslationX = (
    externalTranslation: number,
    index: number,
    screenWidth: number
  ): number => {
    "worklet";
    const minOffset = -screenWidth;
    const maxOffset = screenWidth;

    return clamp(externalTranslation + index * screenWidth, minOffset, maxOffset);
  };

  const getZIndex = (index: number, selectedIndex: number): number => {
    "worklet";
    return 1000 - Math.abs(index - selectedIndex);
  };

  const getVisibility = (
    index: number,
    selectedIndex: number,
    prevSelectedIndex: number | undefined,
    isSwiping: boolean
  ): boolean => {
    "worklet";
    if (isSwiping) {
      // 스와이프 중: 현재/이전/인접 탭 모두 표시
      return index === selectedIndex || index === prevSelectedIndex || Math.abs(index - selectedIndex) === 1;
    }

    // 스와이프 끝: 현재/이전만 표시
    return index === selectedIndex || index === prevSelectedIndex;
  };

  const updateTranslation = (targetValue: number, isSwiping: boolean): number => {
    "worklet";
    if (isSwiping) {
      // 스와이프 중에는 즉시 반영
      return targetValue;
    } else {
      // 스와이프 끝나면 애니메이션
      return withTiming(targetValue, {
        duration: DEFAULT_ANIMATION_DURATION,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const defaultTranslationX = getDefaultTranslationX(externalTranslationX.value, index, SCREEN_WIDTH);
    const clampedTranslationX = getClampedTranslationX(externalTranslationX.value, index, SCREEN_WIDTH);

    const targetTranslationX = skipIntermediateTabs ? clampedTranslationX : defaultTranslationX;

    translationX.value = updateTranslation(targetTranslationX, isSwiping.value);

    const zIndex = getZIndex(index, selectedIndex);
    const isVisible = getVisibility(index, selectedIndex, prevSelectedIndex, isSwiping.value);

    return {
      transform: [{ translateX: translationX.value }],
      opacity: isVisible || !skipIntermediateTabs ? 1 : 0,
      zIndex,
    };
  });

  return (
    <Animated.View className="h-full absolute" style={[{ width: SCREEN_WIDTH }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
