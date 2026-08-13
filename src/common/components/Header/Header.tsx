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
  centered?: boolean;
}

export default function Header(props: HeaderProps) {
  const { renderLeft, renderRight, style, title, className, centered = true } = props;

  const renderTitle = useCallback(() => {
    if (typeof title === "string") {
      return (
        <View className={cn("flex-1", centered && "items-center justify-center")}>
          <Typography className="text-black text-14 font-semibold">{title}</Typography>
        </View>
      );
    }
    return title;
  }, [title, centered]);

  return (
    <View style={style} className={cn("flex flex-row items-center bg-white py-5", className)}>
      {centered ? (
        <>
          <View className="z-10 flex-row justify-start">{renderLeft}</View>
          <View className="absolute left-0 right-0 items-center justify-center">
            {title && renderTitle()}
          </View>
          <View className="z-10 ml-auto flex-row justify-end">{renderRight}</View>
        </>
      ) : (
        <>
          <View className="flex-row justify-start">{renderLeft}</View>
          <View className="min-w-0 flex-1">{title && renderTitle()}</View>
          <View className="flex-row justify-end">{renderRight}</View>
        </>
      )}
    </View>
  );
}
