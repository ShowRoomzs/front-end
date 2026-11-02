import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 게시물 카드 자리 표시 — 디자인 시스템 §07 스켈레톤 예시 그대로.
 *
 * 아바타 36 원 · 이름 38%×11 · 아이디 22%×9(보조) / 미디어 16:10 / 본문 90%×11 · 64%×11(보조).
 * 바깥 여백과 0.5px 구분선은 실제 카드(PostCard)와 같게 두어, 로드 뒤 카드 경계가 움직이지 않는다.
 * `Skeleton` 안에 넣어 쓴다.
 */
export default function PostCardSkeleton() {
  return (
    <View className="border-b-[0.5px] border-divider bg-white pb-14 pt-12">
      <View className="flex-row items-center px-14 pb-10" style={{ gap: 10 }}>
        <SkeletonBlock width={36} height={36} radius={18} />
        <View className="min-w-0 flex-1" style={{ gap: 6 }}>
          <SkeletonBlock width="38%" height={11} />
          <SkeletonBlock width="22%" height={9} sub />
        </View>
      </View>

      <SkeletonBlock radius={0} style={{ aspectRatio: 16 / 10 }} />

      <View className="px-14" style={{ paddingTop: 13, gap: 7 }}>
        <SkeletonBlock width="90%" height={11} />
        <SkeletonBlock width="64%" height={11} sub />
      </View>
    </View>
  );
}
