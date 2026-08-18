import { Text, TextProps } from "react-native";

import { TYPOGRAPHY_TOKENS, TypographyVariant } from "@/common/components/Typography/tokens";
import { cn } from "@/common/utils/cn";

export type TypographyProps = TextProps & {
  /**
   * 디자인 시스템 02의 타이포 토큰. 지정하면 크기·굵기·행간·자간이 한 번에 잡힌다.
   * 색은 토큰에 넣지 않았다 — 같은 크기가 화면마다 다른 위계를 갖기 때문에 className으로 준다.
   */
  variant?: TypographyVariant;
};

export default function Typography(props: TypographyProps) {
  const { className, variant, style, ...restProps } = props;

  return (
    <Text
      className={cn(className)}
      style={variant ? [TYPOGRAPHY_TOKENS[variant], style] : style}
      {...restProps}
    />
  );
}
