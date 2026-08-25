import { TouchableOpacity } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 문의 내역 탭 한 칸 (C12) — 높이 46 · 활성은 잉크 600 + 하단 2px 밑줄, 비활성은 #8E8E8E 400.
 *
 * 개수는 라벨과 같은 크기·굵기를 쓰되 색만 한 단계 흐리게 둔다. 크기를 줄이면 숫자가
 * 라벨의 첨자처럼 보여, 목록에 몇 건이 있는지 훑을 때 눈에 안 걸린다.
 *
 * 활성 탭에 잉크(#0F0F0F)를 쓰고 로즈를 쓰지 않는 이유는 로즈가 공구 신호 전용이기 때문이다.
 */
interface InquiryHistoryTabItemProps {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}

export default function InquiryHistoryTabItem(props: InquiryHistoryTabItemProps) {
  const { label, count, isActive, onPress } = props;
  const textStyle = {
    fontSize: 14,
    fontWeight: isActive ? ("600" as const) : ("400" as const),
    lineHeight: 14,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="h-46 flex-1 flex-row items-center justify-center"
      style={{ gap: 5, ...(isActive ? { borderBottomWidth: 2, borderBottomColor: "#0F0F0F" } : null) }}
    >
      <Typography style={textStyle} className={isActive ? "text-ink" : "text-gray55"}>
        {label}
      </Typography>
      <Typography style={textStyle} className={isActive ? "text-gray45" : "text-gray71"}>
        {count}
      </Typography>
    </TouchableOpacity>
  );
}
