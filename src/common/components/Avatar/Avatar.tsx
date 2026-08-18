import { Image, View } from "react-native";

import { cn } from "@/common/utils/cn";

interface AvatarProps {
  imageUrl?: string | null;
  /** 아바타 지름 — 피드 헤더 36 · 목록 행 44 · 마이 50 · 쇼룸 72 */
  size?: number;
  /**
   * 진행 중인 공구가 있는 쇼룸에만 로즈 실선 링(1.5px + 2px 간격)을 그린다.
   * "지금 살 수 있는 공구가 있다"는 신호이므로 공구가 없으면 링을 그리지 않는다
   * (C1 피드 · C2 팔로잉 · C14 검색 공통). 그라디언트 링은 쓰지 않는다.
   *
   * 링은 지정한 size 안쪽에 그린다 — 바깥에 두르면 링이 있는 행만 아바타가 커져서
   * 목록의 행 높이와 정렬이 카드마다 달라진다.
   */
  hasOngoingGroupBuy?: boolean;
  className?: string;
}

const RING_WIDTH = 1.5;
const RING_GAP = 2;

export default function Avatar(props: AvatarProps) {
  const { imageUrl, size = 36, hasOngoingGroupBuy = false, className } = props;

  const innerSize = hasOngoingGroupBuy ? size - (RING_WIDTH + RING_GAP) * 2 : size;

  const image = (
    <View className="overflow-hidden rounded-full bg-fill" style={{ width: innerSize, height: innerSize }}>
      {!!imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: innerSize, height: innerSize }}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View
      className={cn("items-center justify-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        ...(hasOngoingGroupBuy && { borderWidth: RING_WIDTH, borderColor: "#F2456E" }),
      }}
    >
      {image}
    </View>
  );
}
