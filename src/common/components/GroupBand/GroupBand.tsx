import { View } from "react-native";

/**
 * 회색 밴드 — 성격이 다른 블록 사이를 끊는다(마이의 3개 그룹, 홈의 팔로잉↔추천 경계).
 * 헤어라인 대신 밴드를 쓰는 자리는 "다른 종류의 내용이 시작된다"는 뜻이다.
 *
 * 마이의 그룹 구분은 8, 피드 안의 구분 블록 경계는 5를 쓴다.
 */
interface GroupBandProps {
  height?: number;
}

export default function GroupBand(props: GroupBandProps) {
  const { height = 8 } = props;

  return <View className="bg-band" style={{ height }} />;
}
