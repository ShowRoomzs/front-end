import { View } from "react-native";

import GroupBand from "@/common/components/GroupBand/GroupBand";
import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * C12-1 문의 상세 자리 표시 — 상태 · 유형 · 날짜 줄 → 밴드 8 → 작성자(아바타 28) · 본문 세 줄 → 답변 박스.
 * 틀은 InquiryDetailView(px-14 · 위 18 · 아래 16 · 본문 위 10 · 답변 위 20)를 따른다.
 */
export default function InquiryDetailSkeleton() {
  return (
    <View>
      <View className="flex-row items-center px-14 pb-16 pt-18" style={{ gap: 8 }}>
        <SkeletonBlock width={52} height={22} />
        <SkeletonBlock width={64} height={11} sub />
        <View className="flex-1" />
        <SkeletonBlock width={68} height={11} sub />
      </View>

      <GroupBand height={8} />

      <View className="px-14 pt-18">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <SkeletonBlock width={28} height={28} radius={14} />
          <SkeletonBlock width={64} height={12} />
          <SkeletonBlock width={88} height={10} sub />
        </View>
        <View style={{ marginTop: 16, gap: 12 }}>
          <SkeletonBlock width="92%" height={12} />
          <SkeletonBlock width="84%" height={12} />
          <SkeletonBlock width="48%" height={12} />
        </View>
      </View>

      <View className="px-14 pt-20">
        <SkeletonBlock height={64} radius={8} sub />
      </View>
    </View>
  );
}
