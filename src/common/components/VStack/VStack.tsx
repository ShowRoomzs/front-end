import * as Crypto from "expo-crypto";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

import { cn } from "@/common/utils/cn";

interface VStackProps extends ViewProps {
  gap?: number;
  children?: Array<ReactNode> | ReactNode;
}

export default function VStack(props: VStackProps) {
  const { gap, className, children, ...restProps } = props;

  const childrenArr = Array.isArray(children) ? children : [children];

  return (
    <View className={cn("flex flex-col", className)} {...restProps}>
      {childrenArr.map((child, ix) => {
        const isLast = ix === childrenArr.length - 1;

        return (
          <View key={Crypto.randomUUID()} style={{ marginBottom: isLast ? 0 : gap }}>
            {child}
          </View>
        );
      })}
    </View>
  );
}
