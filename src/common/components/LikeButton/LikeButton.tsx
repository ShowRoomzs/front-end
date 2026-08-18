import { TouchableOpacity, View } from "react-native";

import { HeartIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 좋아요 — 기본 선(잉크) → 누르면 로즈 채움 → 마감된 공구는 #C8C8CA.
 * 옆에 숫자만 표기하고 "좋아요 N개" 문구는 쓰지 않는다. 간격 7.
 *
 * 광학 정렬 — 하트 글리프의 시각적 무게는 박스 중앙보다 아래에 몰려 있어(잉크 범위 y 5→20.6,
 * 중심 ≈12.8) `alignItems: center`만 쓰면 숫자가 위로 떠 보인다. 숫자에 translateY(1px)을 적용해
 * 하트의 광학 중심에 맞춘다. 하트를 위로 올리는 방식은 간격을 더 벌리므로 쓰지 않는다.
 */
interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  /** 마감된 공구 — 새 좋아요는 막고 이미 누른 것의 해제만 허용한다. 품절은 제한하지 않는다 */
  likeLocked?: boolean;
  size?: number;
  onPress: () => void;
}

const HIT_SLOP_VERTICAL = 10;
const HIT_SLOP_HORIZONTAL = 8;

const HEART_COLOR = {
  default: "#0F0F0F",
  liked: "#F2456E",
  /** 마감된 공구 — 눌러도 새로 걸리지 않는다는 것을 색으로 먼저 알린다 */
  locked: "#C8C8CA",
};

export default function LikeButton(props: LikeButtonProps) {
  const { isLiked, likeCount, likeLocked = false, size = 25, onPress } = props;

  // 마감이어도 이미 누른 좋아요는 해제할 수 있다 — 막는 것은 새 좋아요뿐이다
  const isBlocked = likeLocked && !isLiked;

  const getColor = () => {
    if (likeLocked) {
      return HEART_COLOR.locked;
    }
    return isLiked ? HEART_COLOR.liked : HEART_COLOR.default;
  };

  const color = getColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isBlocked}
      activeOpacity={0.4}
      style={{
        alignSelf: "flex-start",
        paddingVertical: HIT_SLOP_VERTICAL,
        paddingHorizontal: HIT_SLOP_HORIZONTAL,
        marginVertical: -HIT_SLOP_VERTICAL,
        marginHorizontal: -HIT_SLOP_HORIZONTAL,
      }}
    >
      <View className="flex-row items-center" style={{ gap: 7 }}>
        <HeartIcon size={size} color={color} filled={isLiked} />
        <Typography
          style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 13.5, transform: [{ translateY: 1 }] }}
          className={likeLocked ? "text-gray62" : "text-ink"}
        >
          {likeCount}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
