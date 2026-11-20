import { ReactNode, useCallback, useMemo } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { extractTextClassName } from "@/common/components/Button/config";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";
/**
 * 공용 버튼 — 디자인 시스템(1021) 값: 모서리 R8 · 라벨 600 · 주 액션 로즈 #F2456E ·
 * 비활성 #F4F4F5 위 #B5B5B5 · 중립 외곽선 1px #E3E3E5 위 #3C3C3C · 누름 로즈 .75 / 그 밖 .55.
 *
 * size(높이) : xs(26), sm(30), md(36), lg(45 — 콘텐츠 안 유도 CTA 14), xl(52 — 하단 고정 CTA 15.5), xxl(59)
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
  activeOpacity?: number;
}

export default function Button(props: ButtonProps) {
  const {
    children,
    className,
    disabled = false,
    onPress,
    size = "md",
    variant = "primary",
    style,
    activeOpacity,
  } = props;

  const getDefaultClassName = () => {
    return "flex flex-row items-center justify-center";
  };

  const getClassNameBySize = useCallback(() => {
    switch (size) {
      case "xxl":
        return "h-59 rounded-base font-semibold";
      case "xl":
        return "h-52 rounded-base font-semibold";
      case "lg":
        return "h-45 rounded-base font-semibold";
      case "md":
        return "h-36 rounded-base font-semibold";
      case "sm":
        return "h-30 rounded-base font-semibold";
      case "xs":
        return "h-26 rounded-[4px] font-semibold";
    }
  }, [size]);

  const getClassNameByVariant = useCallback(() => {
    if (disabled) {
      return "bg-fill text-gray71";
    }
    switch (variant) {
      case "primary":
        return "bg-rose text-white";
      case "secondary":
        return "bg-white border-[1px] border-borderButton text-ink76";
      case "secondary-black":
        return "bg-white border-[1px] border-borderButton text-ink";
      case "outline":
        return "bg-white border-[1px] border-ink text-ink";
      case "ghost":
        return "bg-transparent text-ink76";
      case "primary-point":
        return "bg-rose text-white";
      case "outline-point":
        return "bg-white border-[1px] border-rose text-roseText";
    }
  }, [disabled, variant]);

  const getTextSize = useCallback(() => {
    switch (size) {
      case "xxl":
        return 16;
      case "xl":
        return 15.5;
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
          style={{ fontSize: getTextSize(), lineHeight: getTextSize() }}
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
    <TouchableOpacity
      onPress={handlePress}
      className={cn(getDefaultClassName(), getClassNameBySize(), getClassNameByVariant(), className)}
      style={style}
      // §08 누름 — 로즈 CTA .75 · 그 밖 .55
      activeOpacity={activeOpacity ?? (variant === "primary" || variant === "primary-point" ? 0.75 : 0.55)}
    >
      {content}
    </TouchableOpacity>
  );
}
