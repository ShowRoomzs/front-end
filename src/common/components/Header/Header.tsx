import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { cn } from "@/common/utils/cn";

interface HeaderProps {
  renderLeft?: ReactNode;
  renderRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export default function Header(props: HeaderProps) {
  const { renderLeft, renderRight, style, className } = props;

  return (
    <View style={style} className={cn("flex flex-row justify-between items-center py-5", className)}>
      {renderLeft && renderLeft}
      {renderRight && renderRight}
    </View>
  );
}
