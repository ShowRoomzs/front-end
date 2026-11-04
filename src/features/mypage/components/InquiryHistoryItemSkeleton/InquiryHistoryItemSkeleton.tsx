import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 문의 내역 행 자리 표시 — 1:1 · 상품 문의 탭 공통(px-14 · py-15 · 상태 · 유형 · 날짜 줄 → 본문 두 줄).
 * 행 사이 구분선(0.5)은 목록의 ItemSeparator와 같게 아래에 둔다. `PagingList`의 `skeleton`으로 넘긴다.
 */
export default function InquiryHistoryItemSkeleton() {
  return (
    <View className="border-b-[0.5px] border-dividerProduct px-14 py-15">
      <View className="flex-row items-center" style={{ gap: 7 }}>
        <SkeletonBlock width={52} height={20} />
        <SkeletonBlock width={56} height={10} sub />
        <View className="flex-1" />
        <SkeletonBlock width={64} height={10} sub />
      </View>
      <View style={{ marginTop: 14, gap: 9 }}>
        <SkeletonBlock width="88%" height={12} />
        <SkeletonBlock width="54%" height={12} />
      </View>
    </View>
  );
}
