import { ReactNode, useCallback, useMemo } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

import { extractTextClassName } from "@/common/components/Button/config";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";
/**
 * height 기준 size 정의
 * size : xs(26), sm(30), md(36), lg(46, 47), xl(49), xxl(59)
 */

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-black"
  | "outline"
  | "ghost"
  | "primary-point"
  | "outline-point";

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Button(props: ButtonProps) {
  const { children, className, disabled = false, onPress, size = "md", variant = "primary", style } = props;

  const getDefaultClassName = () => {
    return "flex flex-row items-center justify-center";
  };

  const getClassNameBySize = useCallback(() => {
    switch (size) {
      case "xxl":
        return "h-59 rounded-[6px] font-semibold";
      case "xl":
        return "h-49 rounded-[6px] font-semibold";
      case "lg":
        return "h-46 rounded-[6px] font-semibold";
      case "md":
        return "h-36 rounded-[6px] font-semibold";
      case "sm":
        return "h-30 rounded-[6px] font-semibold";
      case "xs":
        return "h-26 rounded-[4px] font-normal";
    }
  }, [size]);

  const getClassNameByVariant = useCallback(() => {
    if (disabled) {
      return "bg-gray4 text-gray9";
    }
    switch (variant) {
      case "primary":
        return "bg-black text-white";
      case "secondary":
        return "bg-transparent border-[1px] border-gray5 text-gray10";
      case "secondary-black":
        return "bg-transparent border-[1px] border-gray5 text-black";
      case "outline":
        return "bg-transparent border-[1px] border-black text-black";
      case "ghost":
        return "bg-transparent text-gray9";
      case "primary-point":
        return "bg-pointColor text-white";
      case "outline-point":
        return "bg-transparent border-[1px] border-pointColor text-pointColor";
    }
  }, [disabled, variant]);

  const getTextSize = useCallback(() => {
    switch (size) {
      case "xxl":
        return 16;
      case "xl":
        return 16;
      case "lg":
        return 14;
      case "md":
        return 13;
      case "sm":
        return 12;
      case "xs":
        return 12;
    }
  }, [size]);

  const content = useMemo(() => {
    if (typeof children === "string") {
      return (
        <Typography
          className={extractTextClassName(`${getClassNameByVariant()} ${getClassNameBySize()}`)}
          style={{ fontSize: getTextSize() }}
        >
          {children}
        </Typography>
      );
    }
    return children;
  }, [children, getClassNameBySize, getClassNameByVariant, getTextSize]);

  const handlePress = useCallback(() => {
    if (disabled || !onPress) {
      return;
    }
    onPress();
  }, [disabled, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className={cn(getDefaultClassName(), getClassNameBySize(), getClassNameByVariant(), className)}
      style={style}
    >
      {content}
    </Pressable>
  );
}
