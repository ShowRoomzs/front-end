import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import Badge from "@/common/components/Badge/Badge";
import Divider from "@/common/components/Divider/Divider";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import InquiryBadge from "@/features/mypage/components/InquiryBadge/InquiryBadge";
import { ProductInquiryHistory } from "@/features/product/types/productInquiry";

interface ProductInquiryHistoryItemProps {
  item: ProductInquiryHistory;
  onPressEdit: (id: number, productId: number) => void;
  onPressDelete: (id: number) => void;
  onPressProduct: (productId: number) => void;
}

export default function ProductInquiryHistoryItem(props: ProductInquiryHistoryItemProps) {
  const { item, onPressEdit, onPressDelete, onPressProduct } = props;

  /**
   * 상태 배지 — 디자인 C12. **답변 대기가 로즈 채움**, 답변 완료가 중립 회색이다.
   *
   * 강조는 "아직 처리되지 않은 것"에 준다. 완료된 문의를 강조하면 목록이 완료 배지로 덮여
   * 정작 기다리는 건이 묻힌다.
   */
  const statusLabel = useMemo(() => {
    const isWaiting = item.status === "WAITING";

    return <Badge label={isWaiting ? "답변 대기" : "답변 완료"} variant={isWaiting ? "rose" : "neutral"} />;
  }, [item.status]);

  const handlePressEdit = useCallback(() => {
    onPressEdit(item.id, item.productId);
  }, [item.id, item.productId, onPressEdit]);

  const handlePressDelete = useCallback(() => {
    onPressDelete(item.id);
  }, [item.id, onPressDelete]);

  const handlePressProduct = useCallback(() => {
    onPressProduct(item.productId);
  }, [item.productId, onPressProduct]);

  return (
    <View style={{ gap: 15 }} className="flex flex-col p-20 bg-white">
      <HStack gap={6}>
        <InquiryBadge status="QUESTION" />
        <VStack gap={10} className="flex flex-col flex-1">
          <View className="flex flex-row justify-between items-center">
            {statusLabel}
            {item.status === "WAITING" && (
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
          <Typography className="text-11 text-gray9 font-normal">{item.typeName}</Typography>
          <Typography className="text-13 text-black font-medium">{item.content}</Typography>
          <Typography className="text-11 text-gray7 font-normal">
            {dayjs(item.createdAt).format("YYYY.MM.DD")}
          </Typography>
        </VStack>
      </HStack>
      <TouchableOpacity onPress={handlePressProduct} activeOpacity={0.7}>
        <HStack gap={10} className="p-10 items-center border-[1px] border-gray1 rounded-[5px]">
          <Image source={{ uri: item.productImageUrl }} className="w-30 h-30" />
          <VStack gap={5}>
            <Typography className="text-10 text-gray10 font-normal">{item.shopName}</Typography>
            <Typography className="text-13 text-black font-medium">{item.productName}</Typography>
          </VStack>
        </HStack>
      </TouchableOpacity>
      {item.status === "ANSWERED" && (
        <>
          <Divider height={1} wrapperClassName="bg-gray2" />
          <HStack gap={6}>
            <InquiryBadge status="ANSWER" />
            <VStack gap={10} className="flex flex-col flex-1">
              <Typography className="text-12 text-black font-semibold">{`${item.shopName} 담당자`}</Typography>
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
