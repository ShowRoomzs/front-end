import { Image, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { ProductDetail } from "@/features/product/types/product";

/**
 * C7-1 상단에 고정되는 상품 카드 — 지금 무엇에 대해 묻고 있는지 붙잡아 둔다.
 *
 * 1:1 문의(C12)에는 이 자리에 **관련 주문**이 오지만, 상품 문의는 아직 사지 않은 사람이 묻는
 * 자리라 주문이 없다. 대신 상품이 그 자리를 대신한다.
 *
 * 가격을 넣지 않는다 — 여기서 할 일은 "이 상품이 맞나" 확인이지 값을 다시 따지는 게 아니고,
 * 값은 바로 앞 화면(C7)에서 이미 보고 왔다.
 */
interface ProductInquiryProductCardProps {
  product: ProductDetail | undefined;
}

const THUMB_SIZE = 56;

export default function ProductInquiryProductCard(props: ProductInquiryProductCardProps) {
  const { product } = props;

  if (!product) {
    return null;
  }

  return (
    <View className="flex-row items-center border-b-[0.5px] border-divider p-14" style={{ gap: 12 }}>
      <View
        className="overflow-hidden bg-fill"
        style={{ width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 4 }}
      >
        {!!product.representativeImageUrl && (
          <Image
            source={{ uri: product.representativeImageUrl }}
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          />
        )}
      </View>

      <View className="min-w-0 flex-1">
        <Typography style={{ fontSize: 11.5, lineHeight: 15.5 }} className="text-gray45" numberOfLines={1}>
          {product.marketName}
        </Typography>
        <Typography
          style={{ fontSize: 13.5, lineHeight: 18.9, marginTop: 4 }}
          className="text-ink80"
          numberOfLines={1}
        >
          {product.name}
        </Typography>
      </View>
    </View>
  );
}
