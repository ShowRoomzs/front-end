import { ScrollView, TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 카테고리 필터 칩 — 높이 34 · R8 · 활성 잉크 채움(라벨 600) / 비활성 흰 배경 + 1px #E3E3E5(라벨 400).
 * 가로 스크롤이고 히트 영역은 상하 패딩으로 44를 확보한다.
 *
 * 선택 상태를 로즈로 칠하지 않는다 — 로즈는 공구 신호 전용이라 필터는 잉크로 구분한다.
 * 칩은 배타 선택 필터에만 쓴다(삭제 가능한 항목 목록에는 목록형 행을 쓴다).
 */
export interface FilterChipItem<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  items: Array<FilterChipItem<T>>;
  selectedValue: T;
  onSelect: (value: T) => void;
}

const HIT_SLOP_PADDING = 5;

export default function FilterChips<T extends string>(props: FilterChipsProps<T>) {
  const { items, selectedValue, onSelect } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 14, gap: 6 }}
    >
      {items.map(item => {
        const isActive = item.value === selectedValue;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.7}
            style={{ paddingVertical: HIT_SLOP_PADDING }}
          >
            <View
              className={`h-34 flex-row items-center justify-center rounded-base px-12 ${
                isActive ? "bg-ink" : "border-[1px] border-borderButton bg-white"
              }`}
            >
              <Typography
                style={{ fontSize: 13, fontWeight: isActive ? "600" : "400", lineHeight: 13 }}
                className={isActive ? "text-white" : "text-ink76"}
              >
                {item.label}
              </Typography>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
