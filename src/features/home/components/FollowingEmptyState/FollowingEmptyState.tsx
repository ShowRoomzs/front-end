import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 팔로우한 쇼룸이 없을 때.
 *
 * 쇼룸 목록을 나열하는 대신 아래로 발견(discovery) 피드를 그대로 이어 붙인다 — 이름만 있는
 * 목록으로는 팔로우를 결정할 근거가 없지만, 게시물을 보면 무엇을 파는 쇼룸인지 바로 판단할 수 있다.
 * 그래서 이 블록은 화면을 채우지 않고 짧게 끝난다.
 */
interface FollowingEmptyStateProps {
  onPressSearch: () => void;
}

export default function FollowingEmptyState(props: FollowingEmptyStateProps) {
  const { onPressSearch } = props;

  return (
    <View className="items-center bg-white px-30 pb-28 pt-36">
      <Typography style={{ fontSize: 17, fontWeight: "700", lineHeight: 24 }} className="text-ink">
        팔로우한 쇼룸이 없어요
      </Typography>
      <Typography variant="promptBody" className="mt-8 text-center text-gray45">
        {"쇼룸을 팔로우하면 새 공구와 게시물이\n이 피드에 모여요"}
      </Typography>
      <TouchableOpacity onPress={onPressSearch} activeOpacity={0.8} className="mt-18">
        <View className="h-45 flex-row items-center justify-center rounded-base bg-rose px-28">
          <Typography variant="buttonInline" className="text-white">
            쇼룸 검색하기
          </Typography>
        </View>
      </TouchableOpacity>
    </View>
  );
}
