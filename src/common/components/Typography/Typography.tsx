import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { TYPOGRAPHY_TOKENS, TypographyVariant } from "@/common/components/Typography/tokens";
import { cn } from "@/common/utils/cn";

/**
 * 앱의 모든 글자가 지나가는 자리 — 여기서 **Pretendard 를 물린다.**
 *
 * React Native 는 CSS 처럼 글꼴이 상속되지 않아서 `Text` 마다 `fontFamily` 를 줘야 한다.
 * 그게 없던 동안에는 안드로이드·iOS 가 각자 시스템 글꼴로 그렸고, Apple SD Gothic Neo 가
 * 같은 pt 에서 더 작게 보여 **iOS 글자만 작다**는 증상이 났다.
 *
 * 굵기마다 **파일이 다르다.** Pretendard 정적 파일은 Regular/Bold 만 한 패밀리를 공유하고
 * Medium·SemiBold 는 별도 패밀리라, `fontWeight` 하나로는 고를 수 없기 때문이다.
 * 그래서 굵기를 읽어 글꼴 이름을 직접 고르고, **`fontWeight` 는 넘기지 않는다** —
 * 이미 굵은 글꼴에 굵기까지 주면 플랫폼이 가짜 볼드를 덧씌운다.
 */
export type TypographyProps = TextProps & {
  /**
   * 디자인 시스템 02의 타이포 토큰. 지정하면 크기·굵기·행간·자간이 한 번에 잡힌다.
   * 색은 토큰에 넣지 않았다 — 같은 크기가 화면마다 다른 위계를 갖기 때문에 className으로 준다.
   */
  variant?: TypographyVariant;
};

const FAMILY_BY_WEIGHT: Record<string, string> = {
  "100": "Pretendard-Regular",
  "200": "Pretendard-Regular",
  "300": "Pretendard-Regular",
  "400": "Pretendard-Regular",
  normal: "Pretendard-Regular",
  "500": "Pretendard-Medium",
  "600": "Pretendard-SemiBold",
  "700": "Pretendard-Bold",
  bold: "Pretendard-Bold",
  // 800 은 앱에서 한 곳뿐이고 800 파일을 따로 받지 않았다 — Bold 로 합친다
  "800": "Pretendard-Bold",
  "900": "Pretendard-Bold",
};

/**
 * `className` 으로 준 굵기.
 *
 * NativeWind 는 `Typography` 바깥(안쪽 `Text`)에서 className 을 스타일로 바꾸기 때문에
 * 컴포넌트가 그 결과를 볼 수 없다. 대신 **문자열을 직접 읽는다** — 86곳을 고치지 않아도 된다.
 */
const WEIGHT_BY_CLASS: Record<string, string> = {
  "font-thin": "100",
  "font-extralight": "200",
  "font-light": "300",
  "font-normal": "400",
  "font-medium": "500",
  "font-semibold": "600",
  "font-bold": "700",
  "font-extrabold": "800",
  "font-black": "900",
};

const WEIGHT_CLASS_PATTERN = /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g;

function resolveWeight(style: TextStyle | undefined, className: string | undefined): string {
  if (style?.fontWeight) {
    return String(style.fontWeight);
  }

  const matched = className?.match(WEIGHT_CLASS_PATTERN)?.at(-1);

  return matched ? WEIGHT_BY_CLASS[matched] : "400";
}

export default function Typography(props: TypographyProps) {
  const { className, variant, style, ...restProps } = props;

  const flattened = StyleSheet.flatten([variant ? TYPOGRAPHY_TOKENS[variant] : null, style]) as
    | TextStyle
    | undefined;

  const weight = resolveWeight(flattened, className);

  /*
    굵기 클래스는 떼어 낸다. 남겨 두면 NativeWind 가 `fontWeight` 를 다시 얹어,
    이미 굵은 글꼴 위에 가짜 볼드가 한 번 더 들어간다.
  */
  const classNameWithoutWeight = className?.replace(WEIGHT_CLASS_PATTERN, "").trim();

  return (
    <Text
      className={cn(classNameWithoutWeight)}
      style={[flattened, { fontFamily: FAMILY_BY_WEIGHT[weight], fontWeight: undefined }]}
      {...restProps}
    />
  );
}
