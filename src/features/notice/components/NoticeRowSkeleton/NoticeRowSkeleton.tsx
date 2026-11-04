import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 공지 행 자리 표시 — NoticeAccordion 머리와 같은 틀(위 구분선 · px-14 · py-16 · 날짜 줄 + 제목 줄).
 * `PagingList`의 `skeleton`으로 넘긴다.
 */
export default function NoticeRowSkeleton() {
  return (
    <View className="border-t-[0.5px] border-dividerProduct px-14 py-16">
      <SkeletonBlock width={64} height={9} sub />
      <SkeletonBlock width="68%" height={12} style={{ marginTop: 11 }} />
    </View>
  );
}
