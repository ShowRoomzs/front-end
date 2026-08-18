import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 팔로잉 게시물을 다 본 자리에 놓이는 구분 블록.
 *
 * 이 블록과 아래의 [회원님을 위한 추천] 라벨이 없으면, 팔로우한 적 없는 쇼룸의 게시물이
 * 내 피드에 낀 광고처럼 느껴진다. 위아래를 회색 밴드로 끊어 두 영역을 섞지 않는다.
 */
export default function FeedCaughtUp() {
  return (
    <View
      className="items-center bg-white"
      style={{ paddingHorizontal: 30, paddingTop: 26, paddingBottom: 22 }}
    >
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={8.5} stroke="#C7C7C7" strokeWidth={1.7} strokeLinejoin="round" />
        <Path
          d="M8.6 12.2l2.4 2.4 4.4-5"
          stroke="#C7C7C7"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Typography
        style={{ fontSize: 14, fontWeight: "600", lineHeight: 21, marginTop: 11 }}
        className="text-center text-ink"
      >
        새 게시물을 모두 확인했어요
      </Typography>
      <Typography
        variant="caption"
        style={{ lineHeight: 20, marginTop: 5 }}
        className="text-center text-gray45"
      >
        팔로우한 쇼룸의 소식은 여기까지예요
      </Typography>
    </View>
  );
}
