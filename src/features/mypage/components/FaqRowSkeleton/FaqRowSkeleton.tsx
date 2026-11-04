import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * FAQ 행 자리 표시 — Accordion 머리와 같은 틀(아래 구분선 · px-14 · py-14 · 「Q」 + 분류 줄 + 질문 줄).
 * 고객센터 첫 진입 · 분류를 바꿔 새로 받을 때 `SkeletonRepeat`으로 되풀이한다.
 */
export default function FaqRowSkeleton() {
  return (
    <View
      className="flex-row items-start border-b-[0.5px] border-dividerProduct px-14 py-14"
      style={{ gap: 10 }}
    >
      <SkeletonBlock width={12} height={15} style={{ marginTop: 3 }} />
      <View className="min-w-0 flex-1" style={{ gap: 9, paddingTop: 2 }}>
        <SkeletonBlock width={52} height={9} sub />
        <SkeletonBlock width="74%" height={13} />
      </View>
    </View>
  );
}
