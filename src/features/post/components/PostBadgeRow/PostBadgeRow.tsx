import { StyleProp, View, ViewStyle } from "react-native";

import Badge from "@/common/components/Badge/Badge";
import { GroupBuyInfo } from "@/features/post/types/post";

/**
 * 공구 게시물의 배지 줄 — [공동구매 D-3] · [유료 광고 포함].
 *
 * **로즈 배지는 게시물당 하나뿐이다.** D-day가 그 하나를 쓰므로 대가관계 표시는 규정상으로도
 * 디자인상으로도 항상 중립 배지다 — 광고를 강조 색으로 칠하면 표시가 아니라 홍보가 된다.
 *
 * 마감되면 D-day가 로즈에서 죽은 배지(#F1F1F2 · #8E8E8E)로 바뀌고 문구도 [공구 마감]이 된다.
 * 상품이 전부 품절이면 [품절]이다 — 일부만 품절일 때는 D-day를 그대로 두고 해당 상품 행에서만
 * 알린다(아직 살 수 있는 게 남았는데 게시물 전체를 덮으면 안 된다).
 */
interface PostBadgeRowProps {
  groupBuy: GroupBuyInfo;
  /** 위아래 여백만 부르는 쪽이 정한다 — 좌우 14는 게시물 본문과 같은 축이라 여기서 고정한다 */
  style?: StyleProp<ViewStyle>;
}

const HORIZONTAL_PADDING = 14;

export default function PostBadgeRow(props: PostBadgeRowProps) {
  const { groupBuy, style } = props;
  const isClosed = groupBuy.status === "CLOSED";
  const isAllSoldOut = groupBuy.products.length > 0 && groupBuy.products.every(product => product.soldOut);

  const getStatusBadge = () => {
    if (isClosed) {
      return <Badge label="공구 마감" variant="closed" />;
    }
    if (isAllSoldOut) {
      return <Badge label="품절" variant="closed" />;
    }
    return <Badge label={`공동구매 D-${groupBuy.dday}`} variant="rose" />;
  };

  return (
    <View className="flex-row" style={[{ gap: 6, paddingHorizontal: HORIZONTAL_PADDING }, style]}>
      {getStatusBadge()}
      {groupBuy.isPaidAd && <Badge label="유료 광고 포함" variant="neutral" />}
    </View>
  );
}
