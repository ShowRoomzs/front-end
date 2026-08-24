import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

import Badge from "@/common/components/Badge/Badge";
import Divider from "@/common/components/Divider/Divider";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { InquiryHistory } from "@/features/inquiry/types/inquiry";
import InquiryBadge from "@/features/mypage/components/InquiryBadge/InquiryBadge";

interface OneOnOneInquiryHistoryItemProps {
  item: InquiryHistory;
  onPressEdit: (id: number) => void;
  onPressDelete: (id: number) => void;
}

export default function OneOnOneInquiryHistoryItem(props: OneOnOneInquiryHistoryItemProps) {
  const { item, onPressEdit, onPressDelete } = props;

  const isWaiting = item.status === "WAITING";

  /**
   * 상태 배지 — 디자인 C12. **답변 대기가 로즈 채움**, 답변 완료가 중립 회색이다.
   *
   * 강조는 "아직 처리되지 않은 것"에 준다. 완료된 문의를 강조하면 목록이 완료 배지로 덮여
   * 정작 기다리는 건이 묻힌다.
   */
  const statusLabel = useMemo(
    () => <Badge label={isWaiting ? "답변 대기" : "답변 완료"} variant={isWaiting ? "rose" : "neutral"} />,
    [isWaiting]
  );

  const handlePressEdit = useCallback(() => onPressEdit(item.id), [item.id, onPressEdit]);
  const handlePressDelete = useCallback(() => onPressDelete(item.id), [item.id, onPressDelete]);

  return (
    <View className="bg-white p-20 w-full" style={{ gap: 15 }}>
      <HStack gap={6} className="items-start w-full">
        <InquiryBadge status="QUESTION" />
        <VStack gap={10} className="flex-1">
          <View className="flex flex-row justify-between items-center">
            {statusLabel}
            {isWaiting && (
              <HStack gap={10} className="items-center">
                <Typography onPress={handlePressEdit} className="text-black text-12 font-medium underline">
                  수정
                </Typography>
                <Typography onPress={handlePressDelete} className="text-black text-12 font-medium underline">
                  삭제
                </Typography>
              </HStack>
            )}
          </View>
          <Typography className="text-11 text-gray9 font-normal">{item.typeName || "이용 문의"}</Typography>
          <Typography className="text-13 text-black font-medium">{item.content}</Typography>
          <Typography className="text-11 text-gray7 font-normal">
            {dayjs(item.createdAt).format("YYYY.MM.DD")}
          </Typography>
        </VStack>
      </HStack>
      {item.status === "ANSWERED" && (
        <>
          <Divider height={1} wrapperClassName="bg-gray2" />
          <HStack gap={6} className="items-start w-full">
            <InquiryBadge status="ANSWER" />
            <VStack gap={10} className="flex-1">
              <Typography className="text-12 text-black font-semibold">쇼룸즈</Typography>
              <Typography className="text-13 text-black font-medium">{item.answerContent}</Typography>
              <Typography className="text-11 text-gray7 font-normal">
                {dayjs(item.answeredAt).format("YYYY.MM.DD")}
              </Typography>
            </VStack>
          </HStack>
        </>
      )}
    </View>
  );
}
