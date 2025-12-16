import { ReactNode } from "react";
import { View } from "react-native";

type TooltipPlacement =
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
  onOpenChange?: (open: boolean) => void;
  lockArrowPosition?: boolean;
}

export default function Tooltip(props: TooltipProps) {
  const { renderContent, gap, lockArrowPosition, onOpenChange, placement, wrapperClassName } = props;

  return <View></View>;
}
