import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";
import { Band } from "@/features/order/components/OrderParts/OrderParts";

/**
 * 주문 카드 자리 표시 — C8 주문 내역의 한 주문(날짜 · 주문번호 머리 + 상품 한 줄 + 버튼 두 개 + 밴드).
 *
 * 틀은 OrderHistoryView 머리(px-14 · 위 16 · 아래 10)와 OrderItemCard `list`(상태 줄 위 13 · 상품 위 11 아래 14 ·
 * 썸네일 64 · 버튼 높이 40 · 간격 7)를 그대로 따른다. `Skeleton` 안에 넣어 쓴다.
 */
export default function OrderCardSkeleton() {
  return (
    <View>
      <View
        className="flex-row items-center justify-between px-14"
        style={{ paddingTop: 16, paddingBottom: 10 }}
      >
        <View style={{ gap: 7 }}>
          <SkeletonBlock width={92} height={13} />
          <SkeletonBlock width={138} height={9} sub />
        </View>
        <SkeletonBlock width={56} height={11} sub />
      </View>

      <View className="px-14">
        <View style={{ paddingTop: 13 }}>
          <SkeletonBlock width="26%" height={12} />
        </View>
        <View className="flex-row" style={{ gap: 12, paddingTop: 11, paddingBottom: 14 }}>
          <SkeletonBlock width={64} height={64} />
          <View className="min-w-0 flex-1" style={{ gap: 7, paddingTop: 2 }}>
            <SkeletonBlock width="24%" height={9} sub />
            <SkeletonBlock width="72%" height={11} />
            <SkeletonBlock width="44%" height={9} sub />
          </View>
        </View>
        <View className="flex-row" style={{ gap: 7, paddingBottom: 14 }}>
          <SkeletonBlock height={40} style={{ flex: 1 }} />
          <SkeletonBlock height={40} style={{ flex: 1 }} />
        </View>
      </View>
      <Band />
    </View>
  );
}
