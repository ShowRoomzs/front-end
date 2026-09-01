import { useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { ProductOptionItem } from "@/features/product/utils/option";

/**
 * 옵션 선택 셀렉트 (시안 C7 · 옵션 시트).
 *
 * 공용 `Dropdown` 대신 전용으로 두는 이유는 이 자리에만 있는 규칙이 셋이기 때문이다 —
 * 열면 목록이 헤더에 **붙고**(위 모서리를 펴고 테두리를 잇는다), 품절 항목을 **지우지 않고**
 * 세 겹으로 구분하며, 앞 그룹을 고르기 전까지 **잠긴다**.
 *
 * 잠금을 문구("용량을 선택해 주세요")로 바꾸지 않는 것도 시안의 결정이다. 안내 문장으로
 * 덮으면 그 자리에 무엇을 고르는 칸이었는지가 사라진다 — 플레이스홀더는 그대로 두고
 * 배경·테두리·글자색만 낮춘다.
 */
const LIST_MAX_HEIGHT = 240;

/** 헤더 라벨 색 — 잠금 #C7C7C7 · 선택 #0F0F0F · 플레이스홀더 #B5B5B5 (시안 `valueColor`) */
function headerLabelClass(isLocked: boolean, hasSelection: boolean) {
  if (isLocked) {
    return "text-gray7";
  }
  return hasSelection ? "text-ink" : "text-gray8";
}

/** 항목 라벨 색 — 품절 #B5B5B5 · 선택 #0F0F0F · 기본 #3C3C3C (시안 `it.color`) */
function itemLabelClass(isSoldOut: boolean, isSelected: boolean) {
  if (isSoldOut) {
    return "text-gray8";
  }
  return isSelected ? "text-ink" : "text-ink76";
}

/** 항목 배경 — 품절 #FAFAFA · 선택 #FEF4F6 · 기본 흰색 (시안 `it.bg`) */
function itemBackground(isSoldOut: boolean, isSelected: boolean) {
  if (isSoldOut) {
    return "#FAFAFA";
  }
  return isSelected ? "#FEF4F6" : "#FFFFFF";
}

interface ProductOptionSelectProps {
  placeholder: string;
  items: Array<ProductOptionItem>;
  selectedOptionId?: number;
  isOpen: boolean;
  /** 직전 그룹이 아직 선택되지 않았다 */
  isLocked: boolean;
  onToggle: () => void;
  onSelect: (optionId: number) => void;
}

export default function ProductOptionSelect(props: ProductOptionSelectProps) {
  const { placeholder, items, selectedOptionId, isOpen, isLocked, onToggle, onSelect } = props;

  const selected = items.find(item => item.optionId === selectedOptionId);

  const handlePressHeader = useCallback(() => {
    if (isLocked) {
      return;
    }
    onToggle();
  }, [isLocked, onToggle]);

  return (
    <View>
      <TouchableOpacity
        onPress={handlePressHeader}
        activeOpacity={isLocked ? 1 : 0.6}
        style={{
          minHeight: 44,
          paddingHorizontal: 13,
          borderWidth: 1,
          borderColor: isLocked ? "#F0F0F0" : "#E3E3E5",
          backgroundColor: isLocked ? "#FAFAFA" : "#FFFFFF",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          // 열려 있으면 아래 모서리를 펴서 목록과 한 덩어리로 붙인다
          borderBottomLeftRadius: isOpen ? 0 : 8,
          borderBottomRightRadius: isOpen ? 0 : 8,
        }}
        className="flex-row items-center justify-between gap-10"
      >
        <Typography
          numberOfLines={1}
          style={{ flex: 1, fontSize: 14.5, lineHeight: 20.3 }}
          className={headerLabelClass(isLocked, !!selected)}
        >
          {selected ? selected.label : placeholder}
        </Typography>
        <ChevronDownIcon
          size={14}
          color="#C7C7C7"
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {isOpen && (
        /* 240 = 6줄. 12개짜리 그룹을 다 펼치면 목록이 시트를 삼켜 CTA가 밀려난다 —
           6줄에서 잘리면 "아래로 더 있다"는 사실 자체가 스크롤 신호가 된다 */
        <ScrollView
          style={{ maxHeight: LIST_MAX_HEIGHT }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          className="rounded-b-base border border-t-0 border-gray3"
        >
          {items.map((item, index) => {
            const isSelected = item.optionId === selectedOptionId;

            return (
              <TouchableOpacity
                key={item.optionId}
                onPress={() => !item.isSoldOut && onSelect(item.optionId)}
                activeOpacity={item.isSoldOut ? 1 : 0.6}
                style={{
                  minHeight: 40,
                  paddingVertical: 4,
                  paddingHorizontal: 13,
                  borderTopWidth: index === 0 ? 0 : 0.5,
                  borderTopColor: "#F0F0F0",
                  // 품절은 면으로 갈린다 — 회색 글씨 하나만으로는 옆 행과 밝기 차가 작아 놓친다
                  backgroundColor: itemBackground(item.isSoldOut, isSelected),
                }}
                className="flex-row items-center gap-10"
              >
                <Typography
                  style={{
                    flex: 1,
                    fontSize: 14,
                    lineHeight: 18.9,
                    fontWeight: isSelected ? "600" : "400",
                    textDecorationLine: item.isSoldOut ? "line-through" : "none",
                  }}
                  className={itemLabelClass(item.isSoldOut, isSelected)}
                >
                  {item.label}
                </Typography>

                {/* 추가금은 우측 끝 — 옵션의 정보가 아니라 금액이라 라벨과 섞지 않는다 */}
                {item.extraPrice > 0 && !item.isSoldOut && (
                  <Typography style={{ fontSize: 12.5, lineHeight: 17.5 }} className="text-gray45">
                    {`+${item.extraPrice.toLocaleString()}원`}
                  </Typography>
                )}

                {/* 칩으로 감싸지 않는다 — 칩은 누를 수 있어 보이는데 이건 상태 표시다 */}
                {item.isSoldOut && (
                  <Typography
                    style={{ fontSize: 12, fontWeight: "600", lineHeight: 15.6 }}
                    className="text-gray62"
                  >
                    품절
                  </Typography>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
