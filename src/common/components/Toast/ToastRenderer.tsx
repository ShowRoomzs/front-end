import { useCallback, useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DEFAULT_OFFSET,
  DISTANCE_THRESHOLD_PERCENT,
  LIMIT_OPPOSITE_OFFSET,
  TYPE_STYLES,
  VELOCITY_THRESHOLD,
} from "@/common/components/Toast/config";
import Typography from "@/common/components/Typography/Typography";
import { useToast, useToastState } from "@/common/providers/ToastProvider/context";
import { cn } from "@/common/utils/cn";

export default function ToastRenderer() {
  const { top, bottom } = useSafeAreaInsets();
  const { currentToast, opacity, translateY } = useToastState();
  const { hide, pauseTimer } = useToast();
  const gestureTranslateY = useSharedValue(0);

  const position = currentToast?.position ?? "bottom";
  const screenHeight = Dimensions.get("window").height;
  const fullWidth = currentToast?.fullWidth ?? false;

  useEffect(() => {
    if (currentToast) {
      gestureTranslateY.value = 0;
    }
  }, [currentToast, gestureTranslateY]);

  const hideAfterDelay = useCallback(
    (delay: number) => {
      setTimeout(() => {
        hide();
      }, delay);
    },
    [hide]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const transforms: Array<{ translateY: number }> = [
      { translateY: translateY.value + gestureTranslateY.value },
    ];

    if (position === "center") {
      const offset = currentToast?.offset;
      const offsetTop = typeof offset === "number" ? offset : (offset?.top ?? 0);

      transforms.push({ translateY: -25 + offsetTop });
    }

    return {
      opacity: opacity.value,
      transform: transforms,
    };
  }, [position, currentToast?.offset]);

  const pan = useMemo(() => {
    if (position === "center") {
      return Gesture.Pan().enabled(false);
    }

    return Gesture.Pan()
      .onBegin(() => {
        runOnJS(pauseTimer)();
      })
      .onUpdate(e => {
        const { velocityY, translationY } = e;
        const swipePercent = Math.abs(translationY) / screenHeight;

        if (position === "bottom") {
          // 아래로 스와이프 (velocityY > VELOCITY_THRESHOLD): 토스트를 아래로 밀어서 닫기 (정방향)
          if (velocityY > VELOCITY_THRESHOLD) {
            runOnJS(hide)();
          }
          // 위로 스와이프 (translationY < 0): 토스트를 위로 당기기 (역방향, 제한)
          else {
            const limitedOffset = Math.min(swipePercent * LIMIT_OPPOSITE_OFFSET, LIMIT_OPPOSITE_OFFSET);

            gestureTranslateY.value = -limitedOffset;
          }
        } else if (position === "top") {
          // 위로 스와이프 (VELOCITY_THRESHOLD < velocityY): 토스트를 위로 밀어서 닫기 (정방향)
          if (VELOCITY_THRESHOLD < velocityY) {
            runOnJS(hide)();
          }
          // 아래로 스와이프 (translationY > 0): 토스트를 아래로 당기기 (역방향, 제한)
          else {
            const limitedOffset = Math.min(swipePercent * LIMIT_OPPOSITE_OFFSET, LIMIT_OPPOSITE_OFFSET);

            gestureTranslateY.value = limitedOffset;
          }
        }
      })
      .onEnd(e => {
        const { velocityY, translationY } = e;
        const distanceThreshold = screenHeight * DISTANCE_THRESHOLD_PERCENT;

        let shouldClose = false;

        if (position === "bottom") {
          // 아래로 스와이프 (translationY > 0) 시 닫힘 조건
          shouldClose =
            (translationY > 0 && Math.abs(velocityY) > VELOCITY_THRESHOLD) ||
            Math.abs(translationY) > distanceThreshold;
        } else if (position === "top") {
          // 위로 스와이프 (translationY < 0) 시 닫힘 조건
          shouldClose =
            (translationY < 0 && Math.abs(velocityY) > VELOCITY_THRESHOLD) ||
            Math.abs(translationY) > distanceThreshold;
        }

        if (shouldClose) {
          runOnJS(hide)();
        } else {
          gestureTranslateY.value = withTiming(0, { duration: 200 });
          runOnJS(hideAfterDelay)(1000);
        }
      });
  }, [position, pauseTimer, screenHeight, gestureTranslateY, hide, hideAfterDelay]);

  if (!currentToast) {
    return null;
  }
  const wrapperClassName = currentToast.wrapperClassName ?? "";
  const labelClassName = currentToast.labelClassName ?? "";

  const renderContent = () => {
    if (typeof currentToast.message === "string") {
      return (
        <Typography className={cn("text-13 font-medium text-white", labelClassName)}>
          {currentToast.message}
        </Typography>
      );
    }
    return currentToast.message;
  };

  const type = currentToast.type ?? "info";

  const getTypeStyle = () => {
    if (type === "point") {
      return {
        borderWidth: 1,
        borderColor: "#EF4A37CC",
        shadowColor: "#EF4A37",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 7.5,
        elevation: 8,
      };
    }
  };

  const getPositionStyle = () => {
    const offset = currentToast.offset;
    const resolvedOffset =
      typeof offset === "number"
        ? { ...DEFAULT_OFFSET, top: offset, bottom: offset }
        : { ...DEFAULT_OFFSET, ...offset };

    switch (position) {
      case "top":
        return {
          top: top + resolvedOffset.top,
          left: resolvedOffset.left,
          right: resolvedOffset.right,
        };
      case "bottom":
        return {
          bottom: bottom + resolvedOffset.bottom,
          left: resolvedOffset.left,
          right: resolvedOffset.right,
        };
      case "center": {
        const screenHeight = Dimensions.get("window").height;
        const offsetLeft = typeof offset === "number" ? 0 : (offset?.left ?? 0);
        const offsetRight = typeof offset === "number" ? 0 : (offset?.right ?? 0);

        return {
          top: screenHeight / 2,
          left: resolvedOffset.left + offsetLeft,
          right: resolvedOffset.right + offsetRight,
        };
      }
    }
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[getPositionStyle(), animatedStyle]}
        pointerEvents="box-none"
        className={cn("absolute z-[9999] items-center", wrapperClassName)}
      >
        <View
          style={getTypeStyle()}
          className={cn("rounded-[6px] px-15 py-10", TYPE_STYLES[type], fullWidth ? "w-full" : "")}
        >
          {renderContent()}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
