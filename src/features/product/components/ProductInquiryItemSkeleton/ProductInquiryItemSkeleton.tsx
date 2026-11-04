import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 상품 문의 행 자리 표시 — ProductInquiryItem과 같은 틀(위 구분선 · px-14 · py-16 · 유형 칩 + 답변 상태 · 본문 · 작성 정보).
 * C7 문의 탭 미리보기와 C7-2 문의 전체가 같이 쓴다. `Skeleton` 안에 넣어 쓴다.
 */
export default function ProductInquiryItemSkeleton() {
  return (
    <View className="px-14" style={{ borderTopWidth: 0.5, borderTopColor: "#F0F0F0", paddingVertical: 16 }}>
      <View className="flex-row items-center justify-between">
        <SkeletonBlock width={52} height={19} />
        <SkeletonBlock width={40} height={11} sub />
      </View>
      <View style={{ gap: 7, marginTop: 12 }}>
        <SkeletonBlock width="84%" height={11} />
        <SkeletonBlock width="24%" height={9} sub />
      </View>
    </View>
  );
}
