import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 목록 위의 카운트 줄 — 좌측에 "팔로잉 쇼룸 4" 같은 개수, 우측에 정렬 텍스트 트리거.
 * 정렬은 칩이 아니라 텍스트 + 바텀 시트로 연다.
 */
interface ListHeaderBarProps {
  countLabel: string;
  sortLabel?: string;
  /**
   * 아래 여백 — 뒤따르는 목록이 자기 위 여백을 얼마나 가지고 있느냐에 따라 다르다.
   * C2 팔로잉은 행이 상하 8밖에 없어 12, C3 좋아요는 카드가 위로 12를 가져서 4다.
   */
  paddingBottom?: number;
  onPressSort?: () => void;
}

const SORT_HIT_SLOP_VERTICAL = 8;

export default function ListHeaderBar(props: ListHeaderBarProps) {
  const { countLabel, sortLabel, paddingBottom = 12, onPressSort } = props;

  return (
    <View className="flex-row items-center px-14 pt-14" style={{ paddingBottom }}>
      <Typography style={{ fontSize: 12, fontWeight: "500", lineHeight: 12 }} className="text-gray55">
        {countLabel}
      </Typography>
      <View className="flex-1" />
      {!!sortLabel && !!onPressSort && (
        <TouchableOpacity
          onPress={onPressSort}
          activeOpacity={0.5}
          className="flex-row items-center"
          style={{
            gap: 4,
            paddingVertical: SORT_HIT_SLOP_VERTICAL,
            paddingLeft: 12,
            marginVertical: -SORT_HIT_SLOP_VERTICAL,
          }}
        >
          <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
            {sortLabel}
          </Typography>
          <ChevronDownIcon size={12} color="#3C3C3C" />
        </TouchableOpacity>
      )}
    </View>
  );
}
