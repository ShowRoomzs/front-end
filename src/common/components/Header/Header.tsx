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
      return (
        <View className="flex-1 items-center justify-center">
          <Typography className="text-black text-14 font-semibold">{title}</Typography>
        </View>
      );
    }
    return title;
  }, [title]);

  return (
    <View style={style} className={cn("flex flex-row items-center bg-white py-5", className)}>
      <View className="flex-row justify-start">{renderLeft}</View>
      <View className="min-w-0 flex-1">{title && renderTitle()}</View>
      <View className="flex-row justify-end">{renderRight}</View>
    </View>
  );
}
