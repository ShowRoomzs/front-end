import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { BundleProduct } from "@/features/product/types/product";

/**
 * 이 공구에서 함께 판매 중 — 상세정보 탭 맨 아래 가로 목록 (시안 C7).
 *
 * 제목에 **"이 공구에서"와 쇼룸 아바타**를 붙였다. 일반 추천이 아니라 **같은 주문에 묶이는
 * 상품**이라는 뜻이고, 그래야 배송비를 한 번만 내는 묶음이라는 사실이 읽힌다.
 *
 * 카드에는 정가 취소선을 두지 않는다 — 130px 폭에 상품명 2줄까지 들어가는 자리라, 가격 줄에
 * 세 값을 밀어 넣으면 정작 결정에 쓰이는 공구가가 가장 작게 읽힌다.
 */
interface ProductBundleSectionProps {
  products: Array<BundleProduct>;
  showroomImageUrl?: string | null;
  onPressProduct: (productId: number) => void;
}

const CARD_WIDTH = 130;

export default function ProductBundleSection(props: ProductBundleSectionProps) {
  const { products, showroomImageUrl, onPressProduct } = props;

  if (products.length === 0) {
    return null;
  }

  return (
    <View>
      <View className="flex-row items-center px-14 pb-12 pt-18" style={{ gap: 7 }}>
        <Avatar imageUrl={showroomImageUrl} size={22} />
        <Typography
          style={{ fontSize: 15, fontWeight: "700", lineHeight: 19.5, letterSpacing: -0.2 }}
          className="min-w-0 flex-1 text-ink"
        >
          이 공구에서 함께 판매 중
        </Typography>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 18, gap: 10 }}
      >
        {products.map(product => (
          <TouchableOpacity
            key={product.id}
            onPress={() => onPressProduct(product.id)}
            activeOpacity={0.6}
            style={{ width: CARD_WIDTH }}
          >
            <View
              className="overflow-hidden rounded-thumbnail bg-fill"
              style={{ width: CARD_WIDTH, height: CARD_WIDTH }}
            >
              {!!product.thumbnailUrl && (
                <Image
                  source={{ uri: product.thumbnailUrl }}
                  style={{ width: CARD_WIDTH, height: CARD_WIDTH }}
                  resizeMode="cover"
                />
              )}
            </View>

            {/* 두 줄 자리를 미리 비워 둔다 — 이름 길이에 따라 가격 줄의 높이가 어긋나지 않게 */}
            <Typography
              style={{ fontSize: 12.5, lineHeight: 17.5, marginTop: 8, paddingRight: 4, minHeight: 35 }}
              className="text-ink80"
              numberOfLines={2}
            >
              {product.name}
            </Typography>

            <View className="flex-row items-baseline" style={{ gap: 5, marginTop: 5 }}>
              {product.discountRate > 0 && (
                <Typography
                  style={{ fontSize: 13.5, fontWeight: "700", lineHeight: 13.5 }}
                  className="text-rose"
                >
                  {`${product.discountRate}%`}
                </Typography>
              )}
              <Typography
                style={{ fontSize: 13.5, fontWeight: "700", lineHeight: 13.5, letterSpacing: -0.2 }}
                className="text-ink"
              >
                {`${formatPrice(product.salePrice)}원`}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
