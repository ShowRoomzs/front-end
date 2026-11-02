import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * C5 게시물 상세 자리 표시 — 상세는 공구 게시물로만 들어오므로 그 틀을 그린다.
 *
 * 헤더(아바타 36 · 이름 · 아이디) → 배지 두 개 → 제목 → 본문 두 줄 → 미디어 16:10 →
 * 「공구 상품」 줄 → 상품 행 하나(썸네일 90 · 이름 두 줄 · 가격). 여백은 PostDetailView와 같게 둔다.
 * 블록 비율은 §07 예시(이름 38% · 아이디 22% 보조 · 본문 90% · 64% 보조)를 따른다.
 * `Skeleton` 안에 넣어 쓴다.
 */
export default function PostDetailSkeleton() {
  return (
    <View>
      <View className="flex-row items-center px-14 py-13" style={{ gap: 10 }}>
        <SkeletonBlock width={36} height={36} radius={18} />
        <View className="min-w-0 flex-1" style={{ gap: 6 }}>
          <SkeletonBlock width="38%" height={11} />
          <SkeletonBlock width="22%" height={9} sub />
        </View>
      </View>

      <View className="flex-row px-14" style={{ gap: 6, paddingTop: 4 }}>
        <SkeletonBlock width={52} height={22} />
        <SkeletonBlock width={64} height={22} sub />
      </View>

      <View className="px-14" style={{ paddingTop: 15 }}>
        <SkeletonBlock width="70%" height={15} />
      </View>

      <View className="px-14" style={{ paddingTop: 15, gap: 9 }}>
        <SkeletonBlock width="90%" height={11} />
        <SkeletonBlock width="64%" height={11} sub />
      </View>

      <SkeletonBlock radius={0} style={{ aspectRatio: 16 / 10, marginTop: 18 }} />

      <View className="px-14 pb-10 pt-20">
        <SkeletonBlock width={72} height={13} />
      </View>

      <View className="flex-row items-center px-22" style={{ gap: 12 }}>
        <SkeletonBlock width={90} height={90} />
        <View className="min-w-0 flex-1" style={{ gap: 8 }}>
          <SkeletonBlock width="90%" height={11} />
          <SkeletonBlock width="64%" height={11} sub />
          <SkeletonBlock width="40%" height={13} style={{ marginTop: 6 }} />
        </View>
      </View>
    </View>
  );
}
