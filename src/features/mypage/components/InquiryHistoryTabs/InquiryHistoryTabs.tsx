import { View } from "react-native";

import InquiryHistoryTabItem from "@/features/mypage/components/InquiryHistoryTabs/InquiryHistoryTabItem";

/**
 * 문의 내역 상단 탭 (C12) — [1:1 문의 N] [상품 문의 N].
 *
 * 두 문의를 한 목록에 섞지 않는 이유는 **답하는 주체와 공개 범위가 다르기** 때문이다
 * (1:1 = 운영팀 · 비공개 / 상품 = 판매자 · 상품 상세에 공개). 섞어 두면 "왜 이 건만 답이 늦지"
 * 같은 오해가 생긴다.
 *
 * 건수를 라벨 옆에 붙여, 탭을 눌러 보기 전에 어느 쪽에 내역이 있는지 먼저 보이게 한다.
 */
export type InquiryKind = "oneToOne" | "product";

interface InquiryHistoryTabsProps {
  selected: InquiryKind;
  oneToOneCount: number;
  productCount: number;
  onSelect: (kind: InquiryKind) => void;
}

export default function InquiryHistoryTabs(props: InquiryHistoryTabsProps) {
  const { selected, oneToOneCount, productCount, onSelect } = props;

  return (
    <View className="flex-row border-b-[0.5px] border-divider bg-white">
      <InquiryHistoryTabItem
        label="1:1 문의"
        count={oneToOneCount}
        isActive={selected === "oneToOne"}
        onPress={() => onSelect("oneToOne")}
      />
      <InquiryHistoryTabItem
        label="상품 문의"
        count={productCount}
        isActive={selected === "product"}
        onPress={() => onSelect("product")}
      />
    </View>
  );
}
