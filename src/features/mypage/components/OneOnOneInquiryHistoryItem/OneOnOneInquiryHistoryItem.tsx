import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import { ChevronDownIcon, MoreIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { InquiryHistory } from "@/features/inquiry/types/inquiry";
import InquiryItemMetaRow from "@/features/mypage/components/InquiryItemMetaRow/InquiryItemMetaRow";
import InquiryOrderCard from "@/features/mypage/components/InquiryOrderCard/InquiryOrderCard";

/**
 * 1:1 문의 한 건 (C12) — 답변이 있으면 **그 자리에서 펼친다**(상품 문의와 같은 규칙).
 *
 * **답변 대기는 펼치지 않는다** — 셰브런도 그리지 않는다. 펼칠 것이 없는데 화살표를 두면
 * 눌러 보고 빈 안내만 확인하게 되고, "답변 대기"라는 상태 표기가 이미 같은 말을 하고 있다.
 * 그 자리에는 대신 ⋯를 두어 수정·삭제로 이어 준다.
 *
 * 펼치면 첨부 사진과 답변이 함께 나온다 — 내가 무엇을 보냈는지 다시 보지 않고는 답변만 읽어서
 * 맥락이 서지 않는다.
 *
 * 답변 주체는 마켓이 아니라 **운영팀 고정**이다. 목록 응답에는 답변자명이 없고 서버가 상세에서
 * 늘 같은 값을 내려주므로 여기서는 상수로 적는다.
 */
const ANSWERER_NAME = "쇼룸즈 고객센터";
const PHOTO_SIZE = 72;

interface OneOnOneInquiryHistoryItemProps {
  item: InquiryHistory;
  onPressMore: (item: InquiryHistory) => void;
}

export default function OneOnOneInquiryHistoryItem(props: OneOnOneInquiryHistoryItemProps) {
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

        {!!item.order && (
          <View style={{ marginTop: 10 }}>
            <InquiryOrderCard order={item.order} />
          </View>
        )}
      </TouchableOpacity>

      {isOpen && (
        <View className="px-14 pb-15">
          {item.imageUrls.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              style={{ marginBottom: 12 }}
            >
              {item.imageUrls.map(url => (
                <Image
                  key={url}
                  source={{ uri: url }}
                  className="rounded-base"
                  style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
                />
              ))}
            </ScrollView>
          )}

          <View className="rounded-base bg-band p-13">
            <View className="flex-row items-baseline" style={{ gap: 6 }}>
              <Typography
                style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
                className="min-w-0 flex-1 text-ink76"
                numberOfLines={1}
              >
                {ANSWERER_NAME}
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
