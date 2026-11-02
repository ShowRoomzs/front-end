import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * C7 상품 상세 자리 표시 — 갤러리(정사각) → 브랜드 줄 → 상품명 두 줄 · 정가 · 판매가 →
 * 밴드 → 배송 두 줄. 여백은 각 섹션(ProductDetailBrandSection · ProductPriceBlock ·
 * ProductDeliveryBlock)과 같게 둔다. 탭 아래 본문은 탭마다 달라 그리지 않는다.
 * `Skeleton` 안에 넣어 쓴다.
 */
export default function ProductDetailSkeleton() {
  return (
    <View>
      <SkeletonBlock radius={0} style={{ aspectRatio: 1 }} />

      <View className="border-b-[0.5px] border-divider px-14" style={{ paddingVertical: 12 }}>
        <SkeletonBlock width="30%" height={11} />
      </View>

      <View className="px-14 pt-14" style={{ gap: 8 }}>
        <SkeletonBlock width="90%" height={13} />
        <SkeletonBlock width="64%" height={13} sub />
        <SkeletonBlock width={56} height={11} sub style={{ marginTop: 8 }} />
        <SkeletonBlock width="40%" height={18} />
      </View>

      <View className="mt-18 h-5 bg-band" />

      <View className="px-14 py-16" style={{ gap: 10 }}>
        <SkeletonBlock width="70%" height={11} />
        <SkeletonBlock width="54%" height={11} sub />
      </View>
    </View>
  );
}
