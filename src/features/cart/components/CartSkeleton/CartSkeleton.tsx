import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * C12 장바구니 자리 표시 — 전체 선택 줄 + 공구 묶음 하나(머리 · 상품 두 줄 · 배송비 줄).
 *
 * 틀은 CartView 전체 선택 줄(px-14 · py-12) · CartGroupSection 머리(pt-14 · pb-4 · 아바타 26) ·
 * CartItemRow(px-14 · py-12 · 간격 10 · 썸네일 60)를 그대로 따른다. `Skeleton` 안에 넣어 쓴다.
 */
export default function CartSkeleton() {
  return (
    <View>
      <View className="flex-row items-center justify-between border-b-[0.5px] border-divider px-14 py-12">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <SkeletonBlock width={20} height={20} />
          <SkeletonBlock width={88} height={11} />
        </View>
        <SkeletonBlock width={44} height={11} sub />
      </View>

      <View className="flex-row items-center px-14 pb-4 pt-14" style={{ gap: 10 }}>
        <SkeletonBlock width={20} height={20} />
        <SkeletonBlock width={26} height={26} radius={13} />
        <SkeletonBlock width="34%" height={12} />
      </View>

      <CartItemRowSkeleton />
      <CartItemRowSkeleton />

      <View className="mx-14 flex-row items-center justify-between border-t-[0.5px] border-dividerProduct py-12">
        <SkeletonBlock width={64} height={10} sub />
        <SkeletonBlock width={72} height={11} />
      </View>
    </View>
  );
}

function CartItemRowSkeleton() {
  return (
    <View className="flex-row px-14 py-12" style={{ gap: 10 }}>
      <View className="pt-2">
        <SkeletonBlock width={20} height={20} />
      </View>
      <SkeletonBlock width={60} height={60} />
      <View className="min-w-0 flex-1" style={{ gap: 7, paddingTop: 2 }}>
        <SkeletonBlock width="78%" height={11} />
        <SkeletonBlock width="46%" height={9} sub />
        <View className="flex-row items-end justify-between" style={{ marginTop: 9 }}>
          <SkeletonBlock width={84} height={28} />
          <SkeletonBlock width={64} height={13} />
        </View>
      </View>
    </View>
  );
}
