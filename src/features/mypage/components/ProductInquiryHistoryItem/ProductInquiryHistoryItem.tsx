import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon, MoreIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import InquiryItemMetaRow from "@/features/mypage/components/InquiryItemMetaRow/InquiryItemMetaRow";
import { ProductInquiryHistory } from "@/features/product/types/productInquiry";

/**
 * 상품 문의 한 건 (C12) — 답변이 있으면 **그 자리에서 펼친다**.
 *
 * 상세 화면으로 보내지 않는 이유는 상품 문의가 질문 하나와 답변 하나로 끝나 목록 안에서
 * 다 읽히기 때문이다. 화면을 옮길 만큼의 내용이 아니다.
 *
 * **답변 대기는 펼치지 않는다** — 셰브런도 그리지 않는다. 펼칠 것이 없는데 화살표를 두면
 * 눌러 보고 빈 안내만 확인하게 되고, "답변 대기"라는 상태 표기가 이미 같은 말을 하고 있다.
 * 그 자리에는 대신 ⋯를 두어 수정·삭제로 이어 준다.
 */
interface ProductInquiryHistoryItemProps {
  item: ProductInquiryHistory;
  onPressMore: (item: ProductInquiryHistory) => void;
}

export default function ProductInquiryHistoryItem(props: ProductInquiryHistoryItemProps) {
  const { item, onPressMore } = props;
  const isAnswered = item.status === "ANSWERED";
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = useCallback(() => {
    if (isAnswered) {
      setIsOpen(prev => !prev);
    }
  }, [isAnswered]);

  const handlePressMore = useCallback(() => onPressMore(item), [item, onPressMore]);

  return (
    <View className="bg-white">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={isAnswered ? 0.6 : 1}
        disabled={!isAnswered}
        className="px-14 py-15"
      >
        <InquiryItemMetaRow
          status={item.status}
          typeName={item.typeName}
          date={dayjs(item.createdAt).format("YYYY.MM.DD")}
        />

        <Typography
          style={{ fontSize: 11.5, lineHeight: 14.95, marginTop: 9 }}
          className="text-gray45"
          numberOfLines={1}
        >
          {`${item.shopName} · ${item.productName}`}
        </Typography>

        <View className="flex-row items-start" style={{ gap: 8, marginTop: 9 }}>
          <Typography
            style={{ fontSize: 14.5, fontWeight: "500", lineHeight: 21 }}
            className="min-w-0 flex-1 text-ink"
            numberOfLines={isOpen ? 8 : 2}
          >
            {item.content}
          </Typography>

          {isAnswered ? (
            <View style={{ marginTop: 4 }}>
              <ChevronDownIcon
                size={14}
                color="#C7C7C7"
                style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={handlePressMore} activeOpacity={0.5} hitSlop={10}>
              <MoreIcon size={20} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="px-14 pb-15">
          <View className="rounded-base bg-band p-13">
            <View className="flex-row items-baseline" style={{ gap: 6 }}>
              <Typography
                style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
                className="min-w-0 flex-1 text-ink76"
                numberOfLines={1}
              >
                {item.shopName}
              </Typography>
              <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
                {item.answeredAt ? dayjs(item.answeredAt).format("YYYY.MM.DD") : ""}
              </Typography>
            </View>

            <Typography style={{ fontSize: 13.5, lineHeight: 22.95, marginTop: 8 }} className="text-ink76">
              {item.answerContent}
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
}
