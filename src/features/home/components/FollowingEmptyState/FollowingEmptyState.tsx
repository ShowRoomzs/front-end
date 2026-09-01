import { TouchableOpacity, View } from "react-native";

import { StorefrontIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 팔로우한 쇼룸이 없을 때.
 *
 * 쇼룸 목록을 나열하는 대신 아래로 발견(discovery) 피드를 그대로 이어 붙인다 — 이름만 있는
 * 목록으로는 팔로우를 결정할 근거가 없지만, 게시물을 보면 무엇을 파는 쇼룸인지 바로 판단할 수 있다.
 * 그래서 이 블록은 화면을 채우지 않고 짧게 끝난다.
 */
interface FollowingEmptyStateProps {
  /**
   * 아래에 발견 피드가 이어지지 **않는** 경우 — 남는 공간을 차지하고 가운데로 둔다.
   *
   * 기본값은 위쪽 고정(시안 C1 — 위 여백 44)이다. 밑으로 추천 게시물이 이어지는 화면에서
   * 이 블록을 가운데로 밀면 피드가 통째로 한 화면 밖으로 내려가 보이지 않게 된다.
   */
  fill?: boolean;
  onPressSearch: () => void;
}

export default function FollowingEmptyState(props: FollowingEmptyStateProps) {
  const { fill = false, onPressSearch } = props;

  return (
    <View className={cn("items-center bg-white px-30", fill ? "flex-1 justify-center pb-60" : "pb-30 pt-44")}>
      <StorefrontIcon size={52} />

      <Typography
        style={{ fontSize: 17, fontWeight: "700", lineHeight: 25.5, letterSpacing: -0.3, marginTop: 18 }}
        className="text-center text-ink"
      >
        팔로우한 쇼룸이 없어요
      </Typography>
      <Typography variant="promptBody" className="mt-8 text-center text-gray45">
        {"쇼룸을 팔로우하면 새 공구와 게시물이\n이 피드에 모여요"}
      </Typography>
      <TouchableOpacity onPress={onPressSearch} activeOpacity={0.8} className="mt-20">
        <View className="h-45 flex-row items-center justify-center rounded-base bg-rose px-22">
          <Typography variant="buttonInline" className="text-white">
            쇼룸 검색하기
          </Typography>
        </View>
      </TouchableOpacity>
    </View>
  );
}
