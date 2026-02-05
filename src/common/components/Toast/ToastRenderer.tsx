import { Dimensions, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";
import { ToastType, useToastState } from "@/common/providers/ToastProvider/context";
import { cn } from "@/common/utils/cn";

const TYPE_STYLES: Record<ToastType, string> = {
  info: "bg-gray14",
  success: "bg-positiveColor",
  error: "bg-negativeColor",
  warning: "bg-pointColor",
};

const DEFAULT_OFFSET = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

export default function ToastRenderer() {
  const { top, bottom } = useSafeAreaInsets();
  const { currentToast, opacity } = useToastState();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
  const position = currentToast.position ?? "bottom";

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
        const offsetTop = typeof offset === "number" ? offset : (offset?.top ?? 0);
        const offsetLeft = typeof offset === "number" ? 0 : (offset?.left ?? 0);
        const offsetRight = typeof offset === "number" ? 0 : (offset?.right ?? 0);

        return {
          top: screenHeight / 2,
          left: resolvedOffset.left + offsetLeft,
          right: resolvedOffset.right + offsetRight,
          transform: [{ translateY: -25 + offsetTop }],
        };
      }
    }
  };

  return (
    <Animated.View
      style={[getPositionStyle(), animatedStyle]}
      pointerEvents="box-none"
      className={cn("absolute z-[9999] items-center", wrapperClassName)}
    >
      <View className={cn("rounded-[6px] px-15 py-10", TYPE_STYLES[type])}>{renderContent()}</View>
    </Animated.View>
  );
}
