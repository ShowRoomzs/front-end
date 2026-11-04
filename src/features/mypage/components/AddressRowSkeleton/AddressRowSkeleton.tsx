import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 배송지 행 자리 표시 — AddressRow와 같은 틀(px-14 · py-16 · 이름 줄 높이 20 · 받는 분 · 주소 두 줄 · 버튼 높이 34).
 * 행 사이 구분선도 AddressRow처럼 첫 행만 뺀다. `Skeleton` 안에 넣어 쓴다.
 */
export default function AddressRowSkeleton(props: { isFirst?: boolean }) {
  return (
    <View
      className="px-14 py-16"
      style={props.isFirst ? undefined : { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }}
    >
      <View className="h-20 flex-row items-center">
        <SkeletonBlock width="28%" height={12} />
      </View>
      <View style={{ gap: 9, marginTop: 10 }}>
        <SkeletonBlock width="40%" height={10} sub />
        <SkeletonBlock width="82%" height={10} />
        <SkeletonBlock width="56%" height={10} />
      </View>
      <View className="flex-row" style={{ gap: 8, marginTop: 12 }}>
        <SkeletonBlock width={52} height={34} />
        <SkeletonBlock width={52} height={34} />
      </View>
    </View>
  );
}
