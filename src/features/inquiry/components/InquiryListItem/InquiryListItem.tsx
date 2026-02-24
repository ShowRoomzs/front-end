import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import { Inquiry } from "../../types/inquiry";

import Divider from "@/common/components/Divider/Divider";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { cn } from "@/common/utils/cn";

export interface InquiryListItemProps {
  inquiry: Inquiry;
  onPressEdit: (id: number) => void;
  onPressDelete: (id: number) => void;
}

export default function InquiryListItem(props: InquiryListItemProps) {
  const { inquiry, onPressEdit, onPressDelete } = props;

  const handleEditPress = useCallback(() => {
    onPressEdit(inquiry.id);
  }, [inquiry.id, onPressEdit]);

  const handleDeletePress = useCallback(() => {
    onPressDelete(inquiry.id);
  }, [inquiry.id, onPressDelete]);

  const formattedDate = inquiry.createdAt.split("T")[0].replace(/-/g, ".");
  const isAnswered = inquiry.status === "ANSWERED";

  return (
    <VStack className="px-20 py-16 bg-white">
      {/* 상단: 상태 및 액션 버튼 */}
      <HStack className="justify-between items-center mb-10">
        <HStack className="items-center" gap={6}>
          {/* ✅ 코드로 구현한 검정색 Q 아이콘 */}
          <View className="w-18 h-18 bg-gray-900 rounded-full items-center justify-center">
            <Typography className="text-10 text-white font-bold">Q</Typography>
          </View>
          <Typography className={cn("font-medium text-14", isAnswered ? "text-point" : "text-gray-800")}>
            {isAnswered ? "답변 완료" : "답변 대기"}
          </Typography>
        </HStack>

        {!isAnswered && (
          <HStack gap={12}>
            <TouchableOpacity onPress={handleEditPress} activeOpacity={0.7}>
              <Typography className="text-13 text-gray-500 underline">수정</Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress} activeOpacity={0.7}>
              <Typography className="text-13 text-gray-500 underline">삭제</Typography>
            </TouchableOpacity>
          </HStack>
        )}
      </HStack>

      {/* 문의 내용 영역 */}
      <VStack gap={4} className="mb-12">
        <Typography className="text-12 text-gray-400">{inquiry.typeName}</Typography>
        <Typography className="text-14 text-gray-900 font-medium leading-5">{inquiry.content}</Typography>
        <Typography className="text-12 text-gray-400 mt-2">{formattedDate}</Typography>
      </VStack>

      {/* 답변 내용 영역 (답변 완료 시 노출) */}
      {isAnswered && inquiry.answerContent && (
        <VStack className="bg-gray-50 p-16 rounded-8 mt-4">
          <HStack className="items-center mb-8" gap={6}>
            {/* ✅ 코드로 구현한 검정색 A 아이콘 */}
            <View className="w-18 h-18 bg-gray-900 rounded-full items-center justify-center">
              <Typography className="text-10 text-white font-bold">A</Typography>
            </View>
            <Typography className="text-13 text-gray-900 font-semibold">
              쇼룸즈 {/* ✅ 기획서에 맞게 쇼룸즈로 수정 */}
            </Typography>
          </HStack>
          <Typography className="text-13 text-gray-700 leading-5 mb-8">{inquiry.answerContent}</Typography>
          {inquiry.answeredAt && (
            <Typography className="text-12 text-gray-400">
              {inquiry.answeredAt.split("T")[0].replace(/-/g, ".")}
            </Typography>
          )}
        </VStack>
      )}

      {/* 하단 디바이더 */}
      <Divider wrapperClassName="mt-16 bg-gray-100" />
    </VStack>
  );
}
