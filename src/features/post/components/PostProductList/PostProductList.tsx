import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { PostProduct } from "@/features/post/types/post";

/**
 * 게시물에 묶인 상품 목록 (C1 카드 · C5 상세).
 *
 * 좌우 여백이 22다 — 상품 관련 액션은 안쪽 여백, 게시물 액션(좋아요)은 바깥 여백 14를 쓴다는
 * 규칙이라, 같은 카드 안에서 무엇에 대한 조작인지가 여백만으로 구분된다.
 *
 * 처음에는 **한 줄만** 보여주고 나머지는 [상품 N개 더보기]로 접는다. 카드가 길어지면 피드에서
 * 다음 게시물까지 가는 거리가 멀어지고, 목록을 다 펼쳐 봐야 하는 사람은 어차피 상세로 들어간다.
 *
 * 품절·마감 상품은 **목록에서 지우지 않는다**. 썸네일을 흑백으로 낮추고 흰 베일을 덮되 형태는
 * 남긴다 — 무슨 상품이었는지 계속 보여야 재입고·다음 공구로 이어진다. 텍스트도 함께 죽인다.
 */
interface PostProductListProps {
  products: Array<PostProduct>;
  /** 목록 전체가 죽은 표기가 된다 — 공구가 마감된 게시물 */
  isClosed?: boolean;
  /** 상세에서는 접지 않고 전부 편다 */
  expandedByDefault?: boolean;
  onPressProduct: (productId: number) => void;
}

const THUMB_SIZE = 90;
const COLLAPSED_COUNT = 1;

export default function PostProductList(props: PostProductListProps) {
  const { products, isClosed = false, expandedByDefault = false, onPressProduct } = props;
  const [isExpanded, setIsExpanded] = useState(expandedByDefault);

  if (products.length === 0) {
    return null;
  }

  const visible = isExpanded ? products : products.slice(0, COLLAPSED_COUNT);
  const hiddenCount = products.length - COLLAPSED_COUNT;

  return (
    <View className="px-22">
      {visible.map((product, index) => {
        const isDead = isClosed || product.soldOut;

        return (
          <TouchableOpacity
            key={product.productId}
            onPress={() => onPressProduct(product.productId)}
            activeOpacity={0.6}
            className="flex-row items-center"
            style={{
              gap: 12,
              paddingTop: index === 0 ? 0 : 9,
              paddingBottom: 9,
              ...(index === 0 ? null : { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }),
            }}
          >
            <View
              className="overflow-hidden bg-fill"
              style={{ width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 4 }}
            >
              {!!product.imageUrl && (
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    // RN 0.76+ 의 filter — 지원되지 않는 환경에서는 아래 흰 베일만 남는다
                    ...(isDead ? { filter: "grayscale(100%)" } : null),
                  }}
                />
              )}

              {isDead && (
                <View
                  className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
                >
                  <Typography
                    style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }}
                    className="text-ink76"
                  >
                    {isClosed ? "공구 마감" : "품절"}
                  </Typography>
                </View>
              )}
            </View>

            <View className="min-w-0 flex-1">
              <Typography
                style={{ fontSize: 13.5, lineHeight: 19.6 }}
                className={isDead ? "text-gray62" : "text-ink80"}
                numberOfLines={2}
              >
                {product.name}
              </Typography>

              <Typography
                style={{ fontSize: 12, lineHeight: 12, marginTop: 8, textDecorationLine: "line-through" }}
                className={isDead ? "text-chevron" : "text-gray71"}
              >
                {formatPrice(product.listPrice)}
              </Typography>

              <View className="flex-row items-baseline" style={{ gap: 6, marginTop: 5 }}>
                <Typography
                  style={{ fontSize: 15, fontWeight: "700", lineHeight: 15 }}
                  className={isDead ? "text-gray62" : "text-rose"}
                >
                  {product.discountRate}%
                </Typography>
                <Typography
                  style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
                  className={isDead ? "text-gray62" : "text-ink"}
                >
                  {formatPrice(product.price)}원
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {hiddenCount > 0 && (
        /* 외곽선 버튼은 시각 높이 38로 두고 상하 3 패딩으로 터치 영역만 44로 넓힌다 */
        <TouchableOpacity
          onPress={() => setIsExpanded(prev => !prev)}
          activeOpacity={0.6}
          style={{ paddingVertical: 3, marginTop: 2 }}
        >
          <View
            className="h-38 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
            style={{ gap: 6 }}
          >
            <Typography
              style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }}
              className="text-ink76"
            >
              {isExpanded ? "상품 접기" : `상품 ${hiddenCount}개 더보기`}
            </Typography>
            <ChevronDownIcon
              size={12}
              color="#3C3C3C"
              style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
