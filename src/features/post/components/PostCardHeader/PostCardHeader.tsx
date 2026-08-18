import { TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import { MoreIcon } from "@/common/components/DsIcon/icons";
import FollowButton from "@/common/components/FollowButton/FollowButton";
import Typography from "@/common/components/Typography/Typography";
import { formatRelativeTime } from "@/common/utils/formatRelativeTime";

/**
 * 게시물 카드 헤더 — 아바타 36 + 쇼룸명 + 타임스탬프, 우측에 팔로우 버튼과 ⋯.
 *
 * 팔로우 버튼은 미팔로우 쇼룸에만 붙고 누르면 사라진다 — 이미 팔로우한 대상에게 버튼 자리를
 * 내주지 않는다(팔로우 취소는 C2 팔로잉·C4 쇼룸에서 한다). 실질적으로 추천 피드에서만 뜬다.
 */
interface PostCardHeaderProps {
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  hasOngoingGroupBuy: boolean;
  isFollowing: boolean;
  publishedAt: string;
  /** C4 쇼룸 안에서는 모든 카드가 같은 쇼룸이라 아바타 링을 그리지 않는다 */
  hideRing?: boolean;
  /** 쇼룸 안에서는 팔로우 버튼도 프로필 영역이 이미 갖고 있다 */
  hideFollowButton?: boolean;
  onPressShowroom: (showroomId: number) => void;
  onPressFollow: (showroomId: number, isFollowing: boolean) => void;
  onPressMore: () => void;
}

const MORE_HIT_SLOP_PADDING = 12;

export default function PostCardHeader(props: PostCardHeaderProps) {
  const {
    showroomId,
    showroomName,
    showroomImageUrl,
    hasOngoingGroupBuy,
    isFollowing,
    publishedAt,
    hideRing = false,
    hideFollowButton = false,
    onPressShowroom,
    onPressFollow,
    onPressMore,
  } = props;

  return (
    <View className="flex-row items-center px-14 pb-10" style={{ gap: 10 }}>
      <TouchableOpacity onPress={() => onPressShowroom(showroomId)} activeOpacity={0.7}>
        <Avatar imageUrl={showroomImageUrl} size={36} hasOngoingGroupBuy={!hideRing && hasOngoingGroupBuy} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPressShowroom(showroomId)}
        activeOpacity={0.7}
        className="min-w-0 flex-1 flex-row items-center"
        style={{ gap: 5 }}
      >
        <Typography variant="handle" className="shrink text-ink" numberOfLines={1}>
          {showroomName}
        </Typography>
        <Typography style={{ fontSize: 13, lineHeight: 16.9 }} className="flex-none text-gray55">
          · {formatRelativeTime(publishedAt)}
        </Typography>
      </TouchableOpacity>

      {!hideFollowButton && !isFollowing && (
        <FollowButton
          isFollowing={false}
          placement="feed"
          onPress={() => onPressFollow(showroomId, isFollowing)}
        />
      )}

      <TouchableOpacity
        onPress={onPressMore}
        activeOpacity={0.4}
        style={{ padding: MORE_HIT_SLOP_PADDING, margin: -MORE_HIT_SLOP_PADDING }}
      >
        <MoreIcon size={20} />
      </TouchableOpacity>
    </View>
  );
}
