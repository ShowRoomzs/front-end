import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import { CheckIcon, ChevronRightIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 바텀 시트 공통 뼈대 — 제목 · 설명 · 항목 목록.
 *
 * 두 형태를 쓴다.
 * - `navigate` 고르면 다음 단계로 넘어가는 목록(신고 사유) — 우측 셰브런 15 #C7C7C7
 * - `select` 값을 고르는 목록(정렬) — 라벨 15.5 · 설명 12.5/#737373 · 체크 로즈 19,
 *   첫 항목 위에 구분선을 두지 않는다
 */
export interface SheetListItem<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SheetListProps<T extends string> {
  title?: string;
  description?: string;
  items: Array<SheetListItem<T>>;
  mode?: "navigate" | "select";
  selectedValue?: T;
  onSelect: (value: T) => void;
  footer?: ReactNode;
}

export default function SheetList<T extends string>(props: SheetListProps<T>) {
  const { title, description, items, mode = "navigate", selectedValue, onSelect, footer } = props;
  const isSelect = mode === "select";

  return (
    <View className="pb-24">
      {!!title && (
        <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }} className="px-20 pb-10">
          {title}
        </Typography>
      )}
      {!!description && (
        <Typography variant="caption" style={{ lineHeight: 20 }} className="px-20 pb-14 text-gray55">
          {description}
        </Typography>
      )}

      {items.map((item, ix) => {
        const isSelected = isSelect && item.value === selectedValue;
        // 값을 고르는 시트는 첫 항목 위에 선을 두지 않는다 — 제목과 목록을 갈라 놓을 이유가 없다
        const showTopBorder = !isSelect && ix === 0;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.6}
            className="flex-row items-center justify-between border-b-[0.5px] border-dividerProduct px-20 py-15"
            style={showTopBorder ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : undefined}
          >
            <View className="flex-1">
              <Typography
                variant={isSelect ? "listItem" : "menuPassive"}
                className={isSelected ? "text-ink" : "text-ink"}
                style={isSelected ? { fontWeight: "600" } : undefined}
              >
                {item.label}
              </Typography>
              {!!item.description && (
                <Typography variant="caption" className="mt-3 text-gray45">
                  {item.description}
                </Typography>
              )}
            </View>

            {isSelect ? isSelected && <CheckIcon size={19} /> : <ChevronRightIcon size={15} />}
          </TouchableOpacity>
        );
      })}

      {footer}
    </View>
  );
}
