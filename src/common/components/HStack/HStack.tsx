import * as Crypto from "expo-crypto";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

import { cn } from "@/common/utils/cn";

interface HStackProps extends ViewProps {
  gap?: number;
  children?: Array<ReactNode> | ReactNode;
}

export default function HStack(props: HStackProps) {
  const { gap, className, children, ...restProps } = props;

  const childrenArr = Array.isArray(children) ? children : [children];

  return (
    <View className={cn("flex flex-row", className)} {...restProps}>
      {childrenArr.map((child, ix) => {
        const isLast = ix === childrenArr.length - 1;

        return (
          <View key={Crypto.randomUUID()} style={{ marginRight: isLast ? 0 : gap }}>
            {child}
          </View>
        );
      })}
    </View>
  );
}
