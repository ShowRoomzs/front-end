import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";

/**
 * 상품명 + 정가 + 할인율·공구가.
 *
 * 순서는 상품명 → 정가 → 할인율 + 공구가로 고정이다. 정가는 취소선이고 "원"을 붙이지 않는다 —
 * 단위가 붙는 것은 실제로 낼 금액 하나뿐이라, 두 숫자가 같은 무게로 읽히지 않는다.
 *
 * 판매 종료(품절·마감) 상태에서는 셋 다 #9E9E9E로 낮추고 취소선 정가만 한 단계 더 내린다.
 */
interface ProductPriceBlockProps {
  name: string;
  regularPrice: number;
  discountRate: number;
  salePrice: number;
  isUnavailable?: boolean;
}

export default function ProductPriceBlock(props: ProductPriceBlockProps) {
  const { name, regularPrice, discountRate, salePrice, isUnavailable = false } = props;

  const hasDiscount = discountRate > 0 && regularPrice > salePrice;

  return (
    <View className="px-14 pt-14">
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21.75, letterSpacing: -0.3 }}
        className={isUnavailable ? "text-gray62" : "text-ink"}
      >
        {name}
      </Typography>

      {hasDiscount && (
        <Typography
          style={{ fontSize: 13, lineHeight: 13, marginTop: 12, textDecorationLine: "line-through" }}
          className={isUnavailable ? "text-chevron" : "text-gray71"}
        >
          {formatPrice(regularPrice)}
        </Typography>
      )}

      <View className="mt-6 flex-row items-baseline" style={{ gap: 8 }}>
        {hasDiscount && (
          <Typography
            style={{ fontSize: 17, fontWeight: "700", lineHeight: 17 }}
            className={isUnavailable ? "text-gray62" : "text-rose"}
          >
            {discountRate}%
          </Typography>
        )}
        <Typography
          style={{ fontSize: 20, fontWeight: "800", lineHeight: 20, letterSpacing: -0.8 }}
          className={isUnavailable ? "text-gray62" : "text-ink"}
        >
          {formatPrice(salePrice)}원
        </Typography>
      </View>
    </View>
  );
}
