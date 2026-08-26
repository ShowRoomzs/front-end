import { TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import FollowButton from "@/common/components/FollowButton/FollowButton";
import HighlightTypo from "@/common/components/HighlightTypo/HighlightTypo";

/**
 * 쇼룸 리스트 행 — 팔로잉(C2) · 검색 결과(C14) · 최근 검색이 같은 규격을 공유한다.
 * 목록마다 다른 행 높이를 만들지 않는다.
 *
 * 구분선(0.5px)을 쓰지 않고 상하 8 패딩만으로 리듬을 만든다. 아바타 44(공구 진행 중이면 로즈 링) ·
 * 간격 12 · 이름 14.5/600 · 보조 줄은 아이디 @handle 12.5/#737373 하나만이다
 * (한 줄 소개·팔로워 수·공구 수는 목록에 넣지 않는다).
 *
 * 셰브런(›)은 붙이지 않는다 — 행 전체가 탭 대상임이 자명한 목록이다.
 */
interface ShowroomRowProps {
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  hasOngoingGroupBuy: boolean;
  /** @handle — FollowingShowroomResponse처럼 서버가 주지 않는 목록에서는 생략한다 */
  handle?: string | null;
  onPress: (showroomId: number) => void;
  /**
   * 검색어 — 넘기면 이름과 아이디의 일치 구간을 로즈 텍스트(#CF3D61)로 하이라이트한다.
   * 왜 이 행이 걸렸는지(이름이 맞았는지 아이디가 맞았는지) 보이게 하기 위해서다.
   */
  keyword?: string;
  /** 검색 결과에는 팔로우 버튼을 두지 않는다 — 행 전체가 쇼룸으로 가는 단일 액션이다 */
  isFollowing?: boolean;
  onPressFollow?: (showroomId: number, isFollowing: boolean) => void;
}

export default function ShowroomRow(props: ShowroomRowProps) {
  const {
    showroomId,
    showroomName,
    showroomImageUrl,
    hasOngoingGroupBuy,
    handle,
    keyword,
    isFollowing,
    onPress,
    onPressFollow,
  } = props;

  // @는 아이디의 일부가 아니라 표기라 하이라이트 대상 문자열에 미리 붙여 둔다
  const handleLabel = handle ? `@${handle}` : "";

  return (
    <TouchableOpacity
      onPress={() => onPress(showroomId)}
      activeOpacity={0.6}
      className="flex-row items-center px-14 py-8"
      style={{ gap: 12 }}
    >
      <Avatar imageUrl={showroomImageUrl} size={44} hasOngoingGroupBuy={hasOngoingGroupBuy} />

      <View className="min-w-0 flex-1">
        <HighlightTypo
          variant="rowName"
          style={{ letterSpacing: -0.2 }}
          className="text-ink"
          numberOfLines={1}
          keyword={keyword ?? ""}
          highlightClassName="text-roseText"
        >
          {showroomName}
        </HighlightTypo>
        {!!handle && (
          <HighlightTypo
            variant="caption"
            className="text-gray45"
            numberOfLines={1}
            keyword={keyword ?? ""}
            highlightClassName="text-roseText"
          >
            {handleLabel}
          </HighlightTypo>
        )}
      </View>

      {isFollowing !== undefined && !!onPressFollow && (
        <FollowButton
          isFollowing={isFollowing}
          placement="list"
          onPress={() => onPressFollow(showroomId, isFollowing)}
        />
      )}
    </TouchableOpacity>
  );
}
