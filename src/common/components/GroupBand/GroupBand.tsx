import { View } from "react-native";

/**
 * 회색 밴드 — 성격이 다른 블록 사이를 끊는다(마이의 3개 그룹, 홈의 팔로잉↔추천 경계).
 * 헤어라인 대신 밴드를 쓰는 자리는 "다른 종류의 내용이 시작된다"는 뜻이다.
 *
 * 시안(C 마이)의 실제 값은 **5px 밴드 + 위 여백 10**이다. 8은 밴드가 아니라 주문 현황 카드
 * 아래의 **흰 여백**이었다 — 색 없는 간격과 회색 밴드를 같은 8로 뭉뚱그리면, 성격이 다른
 * 두 경계가 화면에서 같은 무게로 보인다.
 */
interface GroupBandProps {
  height?: number;
  /** 밴드 위 여백 — 마이의 그룹 사이는 10 */
  marginTop?: number;
}

export default function GroupBand(props: GroupBandProps) {
  const { height = 5, marginTop } = props;

  return <View className="bg-band" style={{ height, marginTop }} />;
}
