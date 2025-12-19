import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import {
  ARROW_ROTATION,
  calculateArrowPosition,
  calculateTooltipFromArrow,
  getBasePlacement,
} from "./config";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { TooltipInstance } from "@/common/providers/TooltipProvider";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export interface TooltipPosition {
  left: number;
  top: number;
}
type TooltipHorizontalPlacement = "left" | "right";
type TooltipVerticalPlacement = "top" | "bottom";
type TooltipSecondHorizontalPlacement = "Left" | "Right";
type TooltipSecondVerticalPlacement = "Top" | "Bottom";

export type TooltipBasePlacement = TooltipHorizontalPlacement | TooltipVerticalPlacement;
export type TooltipSecondPlacement = TooltipSecondHorizontalPlacement | TooltipSecondVerticalPlacement;

export type TooltipPlacement =
  | TooltipBasePlacement
  | `${TooltipHorizontalPlacement}${TooltipSecondVerticalPlacement}`
  | `${TooltipVerticalPlacement}${TooltipSecondHorizontalPlacement}`;

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
    return ARROW_ROTATION[getBasePlacement(placement)];
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
      return <Typography>{renderContent}</Typography>;
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
