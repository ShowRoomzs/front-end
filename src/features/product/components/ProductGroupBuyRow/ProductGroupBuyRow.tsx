import { TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import Badge from "@/common/components/Badge/Badge";
import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { ProductGroupBuy } from "@/features/product/types/product";
import { ProductSaleState, saleStateBadgeLabel } from "@/features/product/utils/saleState";

/**
 * 가격 아래 한 줄 — [공동구매 D-3] + 쇼룸. 탭하면 C4 쇼룸으로 간다.
 *
 * **배지를 쇼룸명 앞에 붙인 이유**는 "누가 연 공구인지"와 "언제까지인지"가 한 문장으로 읽혀야
 * 하기 때문이다. 공동구매에서는 마감 시점이 가격만큼이나 결정에 들어가는 값이라, 가격 블록
 * 바로 아래에 붙여 둘을 한 덩어리로 묶었다.
 *
 * 상품명·가격 **위**에 두지 않은 것은, 공구 주최가 바뀌어도 상품 정보 블록을 그대로 재사용하기
 * 위해서다 — 이 줄만 갈아 끼우면 된다.
 */
interface ProductGroupBuyRowProps {
  groupBuy: ProductGroupBuy;
  /**
   * 배지를 가르는 것은 공구의 마감 여부만이 아니다 — 공구가 열려 있어도 **품절**이면
   * 살 수 없고, 그때도 로즈 D-day를 남기면 배지만 살아 있는 공구처럼 읽힌다(시안 `closedBadge`).
   */
  saleState: ProductSaleState;
  onPressShowroom: (showroomId: number) => void;
}

export default function ProductGroupBuyRow(props: ProductGroupBuyRowProps) {
  const { groupBuy, saleState, onPressShowroom } = props;

  const isUnavailable = saleState !== "ON_SALE";

  return (
    <TouchableOpacity
      onPress={() => onPressShowroom(groupBuy.showroomId)}
      activeOpacity={0.55}
      className="flex-row items-center"
      style={{ gap: 7, marginTop: 12 }}
    >
      {isUnavailable ? (
        <Badge label={saleStateBadgeLabel(saleState)} variant="closed" />
      ) : (
        <Badge label={`공동구매 D-${groupBuy.dday}`} variant="rose" />
      )}

      <View style={{ marginLeft: 3 }}>
        <Avatar imageUrl={groupBuy.showroomImageUrl} size={22} />
      </View>

      <Typography
        style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 16.25 }}
        className={`min-w-0 shrink ${isUnavailable ? "text-gray45" : "text-ink"}`}
        numberOfLines={1}
      >
        {groupBuy.showroomName}
      </Typography>

      <View style={{ marginLeft: -2 }}>
        <ChevronRightIcon size={13} color="#C7C7C7" />
      </View>
    </TouchableOpacity>
  );
}
