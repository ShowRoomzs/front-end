import { ReactNode, useCallback } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface HeaderProps {
  renderLeft?: ReactNode;
  renderRight?: ReactNode;
  title?: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export default function Header(props: HeaderProps) {
  const { renderLeft, renderRight, style, title, className } = props;

  const renderTitle = useCallback(() => {
    if (typeof title === "string") {
      return <Typography className="text-black text-14 font-semibold">{title}</Typography>;
    }
    return title;
  }, [title]);

  return (
    <View style={style} className={cn("flex flex-row justify-between items-center py-5", className)}>
      {renderLeft && renderLeft}
      {title && <View className="absolute left-1/2 -translate-x-1/2">{renderTitle()}</View>}
      {renderRight && renderRight}
    </View>
  );
}
