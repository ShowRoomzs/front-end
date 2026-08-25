import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 문의 목록 위의 카운트 줄 + [답변 대기만] 필터 (C12 문의 내역).
 *
 * 정렬 시트가 아니라 **체크 하나**로 둔 이유는, 이 목록에서 사람이 실제로 하는 일이
 * "내가 기다리는 게 뭐였지"를 확인하는 것 하나이기 때문이다. 선택지를 시트로 늘리면
 * 한 번 더 눌러야 답에 닿는다. 문의 내역은 항상 최신순이면 충분하다.
 *
 * 체크는 켜졌을 때만 로즈로 채운다 — 답변 대기가 곧 강조 대상이라 상태 배지와 색이 맞물린다.
 */
interface InquiryListHeaderProps {
  countLabel: string;
  isWaitingOnly: boolean;
  onToggleWaitingOnly: () => void;
}

const HIT_SLOP_VERTICAL = 8;

export default function InquiryListHeader(props: InquiryListHeaderProps) {
  const { countLabel, isWaitingOnly, onToggleWaitingOnly } = props;

  return (
    <View className="flex-row items-center bg-white px-14 pb-10 pt-14">
      <Typography style={{ fontSize: 12, fontWeight: "500", lineHeight: 12 }} className="text-gray55">
        {countLabel}
      </Typography>
      <View className="flex-1" />

      <TouchableOpacity
        onPress={onToggleWaitingOnly}
        activeOpacity={0.5}
        className="flex-row items-center"
        style={{
          gap: 6,
          paddingVertical: HIT_SLOP_VERTICAL,
          paddingLeft: 12,
          marginVertical: -HIT_SLOP_VERTICAL,
        }}
      >
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 18,
            height: 18,
            borderWidth: 1.5,
            borderColor: isWaitingOnly ? "#F2456E" : "#DEDEE0",
            backgroundColor: isWaitingOnly ? "#F2456E" : "#FFFFFF",
          }}
        >
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4.5 12.5l5 5 10-11"
              stroke={isWaitingOnly ? "#FFFFFF" : "#DEDEE0"}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
          답변 대기만
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
