import { useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { ProductOptionItem } from "@/features/product/utils/option";

/**
 * 옵션 선택 셀렉트 (시안 C7 · 옵션 시트).
 *
 * 공용 `Dropdown` 대신 전용으로 두는 이유는 이 자리에만 있는 규칙이 셋이기 때문이다 —
 * 열면 목록이 헤더에 **붙고**, 품절 항목을 **지우지 않고** 세 겹으로 구분하며, 앞 그룹을
 * 고르기 전까지 **잠긴다**.
 *
 * **헤더와 목록을 테두리 하나로 감싼다.** 시안은 둘을 따로 그린 뒤 열렸을 때 모서리를 펴서
 * 붙이지만, 그렇게 하면 두 상자의 테두리가 맞닿는 자리에서 어긋나거나 겹쳐 보이기 쉽다.
 * 바깥 상자 하나에 `overflow: hidden`을 걸면 항목 배경이 상자 밖으로 새지 않아 **아래
 * 드롭다운을 침범할 수 없다** — 결과 화면은 같고 어긋날 여지만 없앤다.
 *
 * 잠금을 문구("용량을 선택해 주세요")로 바꾸지 않는 것도 시안의 결정이다. 안내 문장으로
 * 덮으면 그 자리에 무엇을 고르는 칸이었는지가 사라진다 — 플레이스홀더는 그대로 두고
 * 배경·테두리·글자색만 낮춘다.
 */

/** 헤더 높이는 **고정**이다 — minHeight로 두면 측정 시점에 따라 줄 높이가 흔들린다 */
const HEADER_HEIGHT = 44;

/**
 * 항목 한 줄의 높이와 한 번에 보여 줄 줄 수.
 *
 * 12개짜리 그룹을 다 펼치면 목록이 시트를 삼켜 총액·CTA가 밀려난다 — 6줄에서 잘리면
 * "아래로 더 있다"는 사실 자체가 스크롤 신호가 된다(시안 C7).
 */
const ROW_HEIGHT = 40;
const VISIBLE_ROW_COUNT = 6;
const LIST_MAX_HEIGHT = ROW_HEIGHT * VISIBLE_ROW_COUNT;

const BORDER_COLOR = "#E3E3E5";
const BORDER_COLOR_LOCKED = "#F0F0F0";
const ROW_DIVIDER_COLOR = "#F0F0F0";

/** 헤더 라벨 색 — 잠금 #C7C7C7 · 선택 #0F0F0F · 플레이스홀더 #B5B5B5 (시안 `valueColor`) */
function headerLabelColor(isLocked: boolean, hasSelection: boolean) {
  if (isLocked) {
    return "#C7C7C7";
  }
  return hasSelection ? "#0F0F0F" : "#B5B5B5";
}

/** 항목 라벨 색 — 품절 #B5B5B5 · 선택 #0F0F0F · 기본 #3C3C3C (시안 `it.color`) */
function itemLabelColor(isSoldOut: boolean, isSelected: boolean) {
  if (isSoldOut) {
    return "#B5B5B5";
  }
  return isSelected ? "#0F0F0F" : "#3C3C3C";
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
  const isScrollable = items.length > VISIBLE_ROW_COUNT;

  const handlePressHeader = useCallback(() => {
    if (isLocked) {
      return;
    }
    onToggle();
  }, [isLocked, onToggle]);

  const renderRows = () =>
    items.map((item, index) => {
      const isSelected = item.optionId === selectedOptionId;

      return (
        <TouchableOpacity
          key={item.optionId}
          onPress={() => !item.isSoldOut && onSelect(item.optionId)}
          activeOpacity={item.isSoldOut ? 1 : 0.6}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minHeight: ROW_HEIGHT,
            paddingVertical: 4,
            paddingHorizontal: 13,
            // 첫 줄은 헤더와 갈리는 선이라 한 단계 진하다
            borderTopWidth: index === 0 ? 1 : 0.5,
            borderTopColor: index === 0 ? BORDER_COLOR : ROW_DIVIDER_COLOR,
            // 품절은 면으로 갈린다 — 회색 글씨 하나만으로는 옆 행과 밝기 차가 작아 놓친다
            backgroundColor: itemBackground(item.isSoldOut, isSelected),
          }}
        >
          <Typography
            style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 18.9,
              fontWeight: isSelected ? "600" : "400",
              color: itemLabelColor(item.isSoldOut, isSelected),
              textDecorationLine: item.isSoldOut ? "line-through" : "none",
            }}
          >
            {item.label}
          </Typography>

          {/* 추가금은 우측 끝 — 옵션의 정보가 아니라 금액이라 라벨과 섞지 않는다 */}
          {item.extraPrice > 0 && !item.isSoldOut && (
            <Typography style={{ fontSize: 12.5, lineHeight: 17.5, color: "#737373" }}>
              {`+${item.extraPrice.toLocaleString()}원`}
            </Typography>
          )}

          {/* 칩으로 감싸지 않는다 — 칩은 누를 수 있어 보이는데 이건 상태 표시다 */}
          {item.isSoldOut && (
            <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 15.6, color: "#9E9E9E" }}>
              품절
            </Typography>
          )}
        </TouchableOpacity>
      );
    });

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: isLocked ? BORDER_COLOR_LOCKED : BORDER_COLOR,
        borderRadius: 8,
        backgroundColor: isLocked ? "#FAFAFA" : "#FFFFFF",
        // 항목 배경이 둥근 모서리 밖으로 새거나 아래 드롭다운을 덮지 못하게 한다
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={handlePressHeader}
        activeOpacity={isLocked ? 1 : 0.6}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          height: HEADER_HEIGHT,
          paddingHorizontal: 13,
        }}
      >
        <Typography
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: 14.5,
            lineHeight: 20.3,
            color: headerLabelColor(isLocked, !!selected),
          }}
        >
          {selected ? selected.label : placeholder}
        </Typography>
        <ChevronDownIcon
          size={14}
          color="#C7C7C7"
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {isOpen &&
        /*
          줄 수가 한 화면에 들어오면 **스크롤 뷰를 쓰지 않는다.** 높이가 정해지지 않은
          ScrollView는 자기 내용만큼 자리를 잡지 못한다(시트 자체가 이미 스크롤 뷰라 중첩
          측정이 깨진다). 긴 목록만 **고정 높이**로 둔다.
        */
        (isScrollable ? (
          <ScrollView
            style={{ height: LIST_MAX_HEIGHT }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {renderRows()}
          </ScrollView>
        ) : (
          <View>{renderRows()}</View>
        ))}
    </View>
  );
}
