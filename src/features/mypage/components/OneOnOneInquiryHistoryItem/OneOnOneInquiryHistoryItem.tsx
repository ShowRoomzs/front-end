import dayjs from "dayjs";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import { MoreIcon, SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { InquiryHistory } from "@/features/inquiry/types/inquiry";
import InquiryItemMetaRow from "@/features/mypage/components/InquiryItemMetaRow/InquiryItemMetaRow";
import InquiryOrderCard from "@/features/mypage/components/InquiryOrderCard/InquiryOrderCard";

/**
 * 1:1 문의 한 건 (C12) — 탭하면 **상세 화면으로 간다**.
 *
 * 상품 문의처럼 그 자리에서 펼치지 않는 이유는, 1:1은 주문 카드 · 첨부 사진 · 이어지는
 * 추가 문의가 붙는 스레드라 목록 안에 접었다 펴기에는 내용이 크기 때문이다.
 *
 * 답변이 있으면 말풍선 + 한 줄 미리보기를 둔다 — 목록에서 "무슨 답이 왔는지" 감을 주면
 * 열어 볼지 말지 결정할 수 있다.
 *
 * ⋯는 **답변 대기일 때만** 나온다. 답변이 등록된 뒤에 문의를 고치면 답변과 어긋난다.
 */
interface OneOnOneInquiryHistoryItemProps {
  item: InquiryHistory;
  onPress: (id: number) => void;
  onPressMore: (item: InquiryHistory) => void;
}

export default function OneOnOneInquiryHistoryItem(props: OneOnOneInquiryHistoryItemProps) {
  const { item, onPress, onPressMore } = props;
  const isWaiting = item.status === "WAITING";

  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);
  const handlePressMore = useCallback(() => onPressMore(item), [item, onPressMore]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      className="bg-white px-14 py-15"
      accessibilityRole="button"
    >
      <InquiryItemMetaRow
        status={item.status}
        typeName={item.typeName}
        date={dayjs(item.createdAt).format("YYYY.MM.DD")}
      />

      <View className="flex-row items-start" style={{ gap: 8, marginTop: 9 }}>
        <Typography
          style={{ fontSize: 14.5, fontWeight: "500", lineHeight: 21 }}
          className="min-w-0 flex-1 text-ink"
          numberOfLines={2}
        >
          {item.content}
        </Typography>

        {isWaiting && (
          <TouchableOpacity onPress={handlePressMore} activeOpacity={0.5} hitSlop={10}>
            <MoreIcon size={20} />
          </TouchableOpacity>
        )}
      </View>

      {!!item.order && (
        <View style={{ marginTop: 10 }}>
          <InquiryOrderCard order={item.order} />
        </View>
      )}

      {!!item.answerContent && (
        <View className="flex-row items-center" style={{ gap: 6, marginTop: 10 }}>
          <SpeechBubbleIcon size={14} />
          <Typography
            style={{ fontSize: 12.5, lineHeight: 17.5 }}
            className="min-w-0 flex-1 text-gray45"
            numberOfLines={1}
          >
            {item.answerContent}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
}
