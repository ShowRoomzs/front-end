import { View } from "react-native";

import GroupBand from "@/common/components/GroupBand/GroupBand";
import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/** C15 회원정보 — 「계정」 라벨 + 이름 · 생년월일 · 휴대폰번호 세 행 → 밴드 → 변경 안내 두 줄 */
export function MemberInfoSkeleton() {
  return (
    <View>
      <View className="px-14 pb-6 pt-20">
        <SkeletonBlock width={32} height={10} sub />
      </View>
      {Array.from({ length: 3 }, (_, index) => (
        <View key={index} className="flex-row items-center justify-between p-14">
          <SkeletonBlock width={60} height={13} sub />
          <SkeletonBlock width={index === 2 ? 112 : 84} height={13} />
        </View>
      ))}
      <View className="mt-10">
        <GroupBand height={5} />
      </View>
      <View className="px-14 pt-20" style={{ gap: 12 }}>
        <SkeletonBlock width={76} height={10} sub />
        <SkeletonBlock width="92%" height={11} />
        <SkeletonBlock width="70%" height={11} />
      </View>
    </View>
  );
}

/**
 * 탈퇴 두 화면 — 두 줄 제목(18) 아래 선택지 · 확인 항목 상자를 `rows`개.
 * 사유 화면은 46 높이 선택지, 확인 화면은 안내 상자라 `rowHeight`로 가른다.
 */
export function WithdrawalSkeleton(props: { rows: number; rowHeight: number }) {
  const { rows, rowHeight } = props;

  return (
    <View>
      <View className="px-14 pt-24" style={{ gap: 12 }}>
        <SkeletonBlock width="52%" height={18} />
        <SkeletonBlock width="38%" height={18} />
      </View>
      <View className="px-14 pt-24" style={{ gap: 8 }}>
        {Array.from({ length: rows }, (_, index) => (
          <SkeletonBlock key={index} height={rowHeight} radius={8} sub />
        ))}
      </View>
    </View>
  );
}
