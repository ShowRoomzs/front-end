import { useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";

export interface InquiryImageUploaderProps {
  imageUrls: Array<string>;
  maxCount?: number;
  onPressAdd: () => void;
  onPressRemove: (index: number) => void;
}

export default function InquiryImageUploader(props: InquiryImageUploaderProps) {
  const { imageUrls, maxCount = 10, onPressAdd, onPressRemove } = props;

  const handleAddPress = useCallback(() => {
    if (imageUrls.length >= maxCount) {
      return;
    }
    onPressAdd();
  }, [imageUrls.length, maxCount, onPressAdd]);

  return (
    <VStack className="mt-20">
      <Typography className="text-14 text-gray-900 font-medium mb-12">사진 첨부</Typography>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack gap={8}>
          {/* 이미지 추가 버튼 */}
          <TouchableOpacity
            onPress={handleAddPress}
            activeOpacity={0.7}
            className="w-80 h-80 rounded-8 border border-gray-200 bg-gray-50 items-center justify-center"
          >
            <VStack className="items-center" gap={4}>
              {/* ✅ 에러 수정: SvgProps로 크기 전달 */}
              <Icon icon={COMMON_ASSETS.plusIcon} width={24} height={24} />
              <Typography className="text-12 text-gray-400">
                {imageUrls.length}/{maxCount}
              </Typography>
            </VStack>
          </TouchableOpacity>

          {/* 등록된 이미지 리스트 */}
          {imageUrls.map((url, index) => {
            const handleRemovePress = () => onPressRemove(index);

            return (
              <TouchableOpacity
                key={`${url}-${index}`}
                onPress={handleRemovePress}
                activeOpacity={0.9}
                className="relative w-80 h-80 rounded-8 overflow-hidden border border-gray-100"
              >
                <Image source={{ uri: url }} style={{ width: "100%", height: "100%" }} />

                {/* 우측 상단 X(삭제) 버튼 */}
                <View className="absolute top-4 right-4 w-20 h-20 bg-black/50 rounded-full items-center justify-center">
                  {/* ✅ 에러 수정: 불확실한 variant="white" 제거 및 크기 명시 */}
                  <Icon icon={COMMON_ASSETS.closeIcon} width={12} height={12} />
                </View>
              </TouchableOpacity>
            );
          })}
        </HStack>
      </ScrollView>
    </VStack>
  );
}
