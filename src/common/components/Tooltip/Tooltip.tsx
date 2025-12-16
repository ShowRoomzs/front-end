import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { calculateArrowPosition, calculateTooltipFromArrow } from "./config";

import Icon from "@/common/components/Icon/Icon";
import { TooltipInstance } from "@/common/providers/TooltipProvider";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export interface TooltipPosition {
  left: number;
  top: number;
}

export type TooltipPlacement =
  | "topLeft"
  | "top"
  | "topRight"
  | "bottomLeft"
  | "bottom"
  | "bottomRight"
  | "leftTop"
  | "left"
  | "leftBottom"
  | "rightTop"
  | "right"
  | "rightBottom";

export interface TooltipProps {
  renderContent: ReactNode | string;
  placement?: TooltipPlacement;
  gap?: number;
  wrapperClassName?: string;
  lockArrowPosition?: boolean;
  arrowOffset?: number;
  tooltipOffset?: number;
}

export default function Tooltip(instance: TooltipInstance) {
  const { config: tooltipProps, isOpen, tooltipRef } = instance;

  const {
    renderContent,
    placement = "bottom",
    gap = 8,
    wrapperClassName = "",
    lockArrowPosition = false,
    arrowOffset = 0,
    tooltipOffset = 0,
  } = tooltipProps;

  const [arrowPosition, setArrowPosition] = useState<TooltipPosition>({
    left: 0,
    top: 0,
  });
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    left: -999,
    top: -999,
  });

  const isPositionCalculated = useSharedValue(false);
  const opacity = useSharedValue(0);

  const updateOpacity = useCallback(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, [opacity]);

  const calculateInitialArrowPosition = useCallback(
    (width: number, height: number, pageX: number, pageY: number) => {
      setArrowPosition(
        calculateArrowPosition(width, height, pageX, pageY, placement, gap, lockArrowPosition, arrowOffset)
      );
    },
    [gap, lockArrowPosition, placement, arrowOffset]
  );

  const handleLayoutTooltip = useCallback(
    (e: LayoutChangeEvent) => {
      e.currentTarget.measure((_, __, width, height) => {
        if (tooltipRef?.current) {
          setTooltipPosition(
            calculateTooltipFromArrow(arrowPosition, width, height, placement, tooltipOffset)
          );
          isPositionCalculated.value = true;
          runOnJS(updateOpacity)();
        }
      });
    },
    [tooltipRef, arrowPosition, placement, tooltipOffset, isPositionCalculated, updateOpacity]
  );

  const getArrowRotate = useCallback(() => {
    if (placement.startsWith("top")) {
      return 180;
    }
    if (placement.startsWith("bottom")) {
      return 0;
    }
    if (placement.startsWith("left")) {
      return 90;
    }
    if (placement.startsWith("right")) {
      return 270;
    }
    return 0;
  }, [placement]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getDefaultWrapperClassName = () => {
    // TODO : 기본 스타일 정의
    return "";
  };

  const content = useMemo(() => {
    if (typeof renderContent === "string") {
      // TODO : Typography로 변경
      return <Text>{renderContent}</Text>;
    }
    return renderContent;
  }, [renderContent]);

  useEffect(() => {
    if (isOpen && tooltipRef?.current) {
      tooltipRef.current.measure((_, __, width: number, height: number, pageX: number, pageY: number) => {
        calculateInitialArrowPosition(width, height, pageX, pageY);
      });
    }
  }, [isOpen, tooltipRef, calculateInitialArrowPosition]);

  // tooltipRef가 변경될 때마다 위치 재계산
  useEffect(() => {
    if (isOpen) {
      isPositionCalculated.value = false;
      opacity.value = 0;
    }
  }, [isOpen, isPositionCalculated, opacity]);

  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      {/* content */}
      <Animated.View
        className="absolute z-[999]"
        onLayout={handleLayoutTooltip}
        style={[{ left: tooltipPosition.left, top: tooltipPosition.top }, animatedStyle]}
      >
        <View className={cn(getDefaultWrapperClassName(), wrapperClassName)}>{content}</View>
      </Animated.View>
      {/* arrow */}
      <Animated.View
        style={[
          {
            left: arrowPosition.left,
            top: arrowPosition.top,
            transform: [{ rotate: `${getArrowRotate()}deg` }],
          },
          animatedStyle,
        ]}
        className="absolute w-[10px] h-[5px] flex justify-center items-center z-[9999]"
      >
        <View>
          <Icon icon={COMMON_ASSETS.tooltipArrow} />
        </View>
      </Animated.View>
    </Fragment>
  );
}
