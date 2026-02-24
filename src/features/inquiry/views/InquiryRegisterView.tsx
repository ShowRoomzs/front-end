import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // ✅ 이미지 피커 라이브러리 추가
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InquiryImageUploader from "../components/InquiryImageUploader/InquiryImageUploader";
import { useGetCategories } from "../hooks/useGetCategories";
import { useCreateInquiryMutation } from "../hooks/useInquiryMutation/useCreateInquiryMutation";
import { InquiryCategory, InquiryCategoryDetail } from "../types/inquiry";

import Button from "@/common/components/Button/Button";
import Dropdown, { DropdownItem } from "@/common/components/Dropdown/Dropdown";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export default function InquiryRegisterView() {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();

  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
  const [selectedDetailTypeKey, setSelectedDetailTypeKey] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<Array<string>>([]);

  const { data: categories } = useGetCategories();
  const { mutateAsync: createInquiry, isPending } = useCreateInquiryMutation();

  const dropdownItems: Array<DropdownItem> = useMemo(() => {
    if (!categories || !selectedCategoryKey) {
      return [];
    }
    const category = categories.find((c: InquiryCategory) => c.key === selectedCategoryKey);

    return category
      ? category.details.map((detail: InquiryCategoryDetail) => ({
          label: detail.description,
          value: detail.key,
        }))
      : [];
  }, [categories, selectedCategoryKey]);

  // ✅ 유효성 검사 (사진은 필수 조건에서 확실히 배제됨)
  const isSubmitEnabled = !!selectedCategoryKey && !!selectedDetailTypeKey && content.length >= 20;

  const handleCategorySelect = useCallback((key: string) => {
    setSelectedCategoryKey(key);
    setSelectedDetailTypeKey("");
  }, []);

  // ✅ 실제 기기 갤러리를 띄우는 로직 구현
  const handleAddImage = useCallback(async () => {
    try {
      // 1. 갤러리 접근 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("권한 필요", "사진을 첨부하려면 갤러리 접근 권한이 필요합니다.");
        return;
      }

      // 2. 이미지 픽커 실행
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // 여러 장 선택 허용
        selectionLimit: 10 - imageUrls.length, // 남은 개수만큼만 선택 가능
        quality: 0.8, // 용량 최적화를 위해 화질 80%로 설정
      });

      // 3. 선택한 이미지들을 기존 상태에 병합
      if (!result.canceled && result.assets) {
        const newUris = result.assets.map(asset => asset.uri);

        setImageUrls(prev => [...prev, ...newUris].slice(0, 10)); // 최대 10장 방어 코드
      }
    } catch (error) {
      console.error("이미지 첨부 중 에러 발생:", error);
    }
  }, [imageUrls.length]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isSubmitEnabled) {
      return;
    }
    try {
      await createInquiry({
        type: selectedCategoryKey as string, // 타입 단언으로 안전성 확보
        detailType: selectedDetailTypeKey,
        content: content,
        // ✅ 수정: undefined 대신 배열 자체를 보냄 (빈 배열이어도 전송)
        imageUrls: imageUrls,
      });
      navigation.goBack();
    } catch (error) {
      console.error("문의 등록 실패", error);
      Alert.alert("등록 실패", "문의 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }, [
    createInquiry,
    selectedCategoryKey,
    selectedDetailTypeKey,
    content,
    imageUrls,
    isSubmitEnabled,
    navigation,
  ]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <HStack className="items-center px-20 py-16 border-b border-gray-100">
          <TouchableOpacity onPress={handleCancel}>
            <Icon icon={COMMON_ASSETS.back} width={24} height={24} />
          </TouchableOpacity>
          <Typography className="flex-1 text-center text-16 font-semibold mr-24">1:1 문의하기</Typography>
        </HStack>

        <ScrollView
          className="flex-1 px-20 pt-20"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ... (중간 코드 동일: 카테고리 / 내용 입력) ... */}
          <View className="flex-row flex-wrap justify-between gap-y-8 mb-24">
            {categories?.map((category: InquiryCategory) => {
              const isSelected = selectedCategoryKey === category.key;

              return (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => handleCategorySelect(category.key)}
                  activeOpacity={0.7}
                  style={{ width: "31%" }}
                  className={cn(
                    "py-12 items-center justify-center rounded-8 border",
                    isSelected ? "border-gray-900 bg-white" : "border-gray-200 bg-gray-50"
                  )}
                >
                  <Typography
                    className={cn("text-14", isSelected ? "text-gray-900 font-bold" : "text-gray-500")}
                  >
                    {category.description}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          <VStack className="mb-24">
            <Typography className="text-14 font-medium mb-8">문의 유형</Typography>
            <Dropdown
              id="inquiry-detail-dropdown"
              items={dropdownItems}
              value={selectedDetailTypeKey}
              onChange={setSelectedDetailTypeKey}
              placeholder="유형을 선택해 주세요"
              disabled={!selectedCategoryKey}
            />
          </VStack>

          <VStack className="mb-24">
            <Typography className="text-14 font-medium mb-8">어떤 점이 좋으셨나요?</Typography>
            <View className="border border-gray-200 rounded-8 p-16 h-160">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="내용을 입력해 주세요"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                maxLength={500}
                style={{ flex: 1, fontSize: 14, color: "#333" }}
              />
            </View>
            <HStack className="justify-between mt-8">
              <Typography className="text-12 text-gray-400">20자 이상</Typography>
              <Typography className="text-12 text-gray-400">{content.length}/500</Typography>
            </HStack>
          </VStack>

          <InquiryImageUploader
            imageUrls={imageUrls}
            onPressAdd={handleAddImage}
            onPressRemove={handleRemoveImage}
            maxCount={10}
          />

          <View className="w-full h-1 bg-gray-100 my-32" />

          <VStack className="mb-40">
            <Typography className="text-14 font-medium mb-12">유의사항</Typography>
            <View className="bg-gray-50 p-16 rounded-8">
              <Typography className="text-13 text-point leading-5 mb-8">
                특별한 유의사항인 경우 이렇게 표시 됩니다. 그리고 두줄이 될 수 있습니다.
              </Typography>
            </View>
          </VStack>
        </ScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-20 flex-row gap-12"
          style={{ paddingBottom: 10 + inset.bottom }}
        >
          <View className="flex-1">
            <Button size="xl" variant="outline" onPress={handleCancel}>
              취소
            </Button>
          </View>
          <View className="flex-1">
            <Button
              size="xl"
              variant="primary"
              onPress={handleSubmit}
              disabled={!isSubmitEnabled || isPending}
            >
              작성하기
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
