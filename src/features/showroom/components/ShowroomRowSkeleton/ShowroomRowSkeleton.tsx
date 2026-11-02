import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 쇼룸 행 자리 표시 — ShowroomRow와 같은 틀(px-14 · py-8 · 간격 12 · 아바타 44).
 *
 * 이름 · 아이디 두 줄은 §07 예시의 비율(38% · 22% 보조)을 따른다. 행 끝에 팔로우 버튼이
 * 붙는 목록(C2 팔로잉 · C14 검색)이면 `withButton`으로 그 자리(64×30)를 함께 그린다.
 * `Skeleton` 안에 넣어 쓴다.
 */
interface ShowroomRowSkeletonProps {
  withButton?: boolean;
}

export default function ShowroomRowSkeleton(props: ShowroomRowSkeletonProps) {
  const { withButton = false } = props;

  return (
    <View className="flex-row items-center px-14 py-8" style={{ gap: 12 }}>
      <SkeletonBlock width={44} height={44} radius={22} />

      <View className="min-w-0 flex-1" style={{ gap: 6 }}>
        <SkeletonBlock width="38%" height={11} />
        <SkeletonBlock width="22%" height={9} sub />
      </View>

      {withButton && <SkeletonBlock width={64} height={30} />}
    </View>
  );
}
