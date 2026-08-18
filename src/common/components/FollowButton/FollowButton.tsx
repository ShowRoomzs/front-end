import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 팔로우 버튼 — 시각 높이 30(좌우 12 · 라벨 12.5/600)에 상하 7 패딩 + 음수 마진으로
 * 히트 영역만 44로 넓힌다. 버튼 자체를 44로 키우면 아바타 36/44와 균형이 깨지므로
 * 커지는 것은 보이지 않는 타깃뿐이다.
 *
 * 배치에 따라 색이 다르다 —
 * - `list` 팔로우가 화면의 주 액션인 목록형 화면(C2 팔로잉 · C14 검색)은 로즈 채움.
 * - `feed` 피드 게시물 헤더는 회색 채움(Fill · 라벨 #3C3C3C). 카드에 이미 D-day·할인율이
 *   로즈를 쓰고 있어 헤더까지 로즈로 채우면 한 카드에 로즈가 두 번 나와 공구 신호가 묻힌다.
 * - 팔로잉(해제 가능) 상태는 중립 외곽선 — 되돌릴 액션은 강조하지 않는다.
 */
type FollowButtonPlacement = "list" | "feed";

interface FollowButtonProps {
  isFollowing: boolean;
  placement?: FollowButtonPlacement;
  onPress: () => void;
  className?: string;
}

const HIT_SLOP_PADDING = 7;

/** 팔로잉(되돌릴 수 있는 상태)은 배치와 무관하게 중립 외곽선 하나다 */
const FOLLOWING_STYLE = { box: "bg-white border-[1px] border-borderButton", text: "text-ink76" };

const FOLLOW_STYLE_BY_PLACEMENT: Record<FollowButtonPlacement, { box: string; text: string }> = {
  list: { box: "bg-rose", text: "text-white" },
  feed: { box: "bg-fill", text: "text-ink76" },
};

export default function FollowButton(props: FollowButtonProps) {
  const { isFollowing, placement = "list", onPress, className } = props;

  const { box: boxClass, text: textClass } = isFollowing
    ? FOLLOWING_STYLE
    : FOLLOW_STYLE_BY_PLACEMENT[placement];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ paddingVertical: HIT_SLOP_PADDING, marginVertical: -HIT_SLOP_PADDING }}
      className={className}
    >
      <View className={cn("h-30 flex-row items-center justify-center rounded-base px-12", boxClass)}>
        <Typography variant="button" className={textClass}>
          {isFollowing ? "팔로잉" : "팔로우"}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
