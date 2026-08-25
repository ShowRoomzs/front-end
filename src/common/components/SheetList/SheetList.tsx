import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import { CheckIcon, ChevronRightIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 바텀 시트 공통 뼈대 — 제목 · 설명 · 항목 목록.
 *
 * 두 형태를 쓴다.
 * - `select` 값을 고르는 목록(정렬 · 문의 유형 · 배송 메모) — 제목 **가운데**,
 *   라벨 15.5/1.35(선택 600 · 잉크 / 비선택 400 · 잉크76), 설명 12.5/1.5, 체크 로즈 19,
 *   항목 패딩 17/20, 첫 항목 위에 구분선을 두지 않는다
 * - `navigate` 고르면 다음 단계로 넘어가는 목록(신고 사유) — 제목 좌측,
 *   라벨 14.5/400, 우측 셰브런 15 #C7C7C7, 항목 패딩 14/20, **모든 항목**에 위 구분선
 *
 * 제목 정렬이 갈리는 이유는 역할이 달라서다. 값을 고르는 시트는 목록이 주인공이라
 * 제목이 가운데에서 이름표 노릇만 하고, 다음 단계로 넘어가는 시트는 제목이 질문이라
 * 본문처럼 좌측에서 읽힌다.
 *
 * ⚠️ 루트는 반드시 `BottomSheetView`다. 시트를 `enableDynamicSizing`으로 띄우므로 높이가
 * **내용 측정값**에서 나오는데, 일반 View는 자기 높이를 시트에 보고하지 않는다. 그러면
 * 내용 높이가 0으로 잡혀 시트가 열려도 화면에 아무것도 보이지 않는다.
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
    <BottomSheetView className="pb-24">
      {!!title && (
        <Typography
          style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
          className={`px-20 pb-12 text-ink ${isSelect ? "text-center" : ""}`}
        >
          {title}
        </Typography>
      )}
      {!!description && (
        <Typography
          style={{ fontSize: 12.5, lineHeight: 20 }}
          className={`px-20 pb-14 text-gray45 ${isSelect ? "text-center" : ""}`}
        >
          {description}
        </Typography>
      )}

      {items.map((item, ix) => {
        const isSelected = isSelect && item.value === selectedValue;
        // 값을 고르는 시트는 첫 항목 위에 선을 두지 않는다 — 제목과 목록을 갈라 놓을 이유가 없다
        const showTopBorder = !isSelect || ix > 0;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.6}
            className="flex-row items-center justify-between px-20"
            style={{
              gap: 12,
              paddingVertical: isSelect ? 17 : 14,
              ...(showTopBorder ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : null),
            }}
          >
            <View className="min-w-0 flex-1">
              <Typography
                style={
                  isSelect
                    ? { fontSize: 15.5, fontWeight: isSelected ? "600" : "400", lineHeight: 20.9 }
                    : { fontSize: 14.5, lineHeight: 14.5 }
                }
                className={isSelected ? "text-ink" : "text-ink76"}
              >
                {item.label}
              </Typography>
              {!!item.description && (
                <Typography
                  style={{ fontSize: 12.5, lineHeight: 18.75, marginTop: 4 }}
                  className="text-gray45"
                >
                  {item.description}
                </Typography>
              )}
            </View>

            {isSelect ? isSelected && <CheckIcon size={19} /> : <ChevronRightIcon size={15} />}
          </TouchableOpacity>
        );
      })}

      {footer}
    </BottomSheetView>
  );
}
