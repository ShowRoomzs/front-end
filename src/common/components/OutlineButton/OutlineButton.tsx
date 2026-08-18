import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 목록 안 [더보기]류 외곽선 보조 버튼 — 시각 높이 38 · R8 · 1px #E3E3E5.
 * 투명 패딩 래퍼(상하 3)로 히트 영역을 44로 올리고, 배경 대신 opacity로 눌림을 표현한다.
 * 펼치면 라벨이 "상품 접기"로 바뀌고 셰브런이 180° 회전한다.
 */
interface OutlineButtonProps {
  label: string;
  expanded?: boolean;
  withChevron?: boolean;
  onPress: () => void;
  className?: string;
}

const HIT_SLOP_PADDING = 3;

export default function OutlineButton(props: OutlineButtonProps) {
  const { label, expanded = false, withChevron = true, onPress, className } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={{ paddingVertical: HIT_SLOP_PADDING }}
      className={className}
    >
      <View
        className={cn(
          "h-38 flex-row items-center justify-center rounded-base border-[1px] border-borderButton",
          "bg-white"
        )}
        style={{ gap: 5 }}
      >
        <Typography variant="button" className="text-ink76">
          {label}
        </Typography>
        {withChevron && (
          <ChevronDownIcon
            size={12}
            color="#3C3C3C"
            style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
