import { Text, TextProps } from "react-native";

import { cn } from "@/common/utils/cn";

export type TypographyProps = TextProps;

export default function Typography(props: TypographyProps) {
  const { className, ...restProps } = props;

  // TODO : typography 정의

  return <Text className={cn(className)} {...restProps} />;
}
