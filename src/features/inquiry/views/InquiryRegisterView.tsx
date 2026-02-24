import { useCallback, useState, useEffect } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";

import InquiryRegisterActions from "../components/InquiryRegisterActions/InquiryRegisterActions";
import InquiryRegisterForm from "../components/InquiryRegisterForm/InquiryRegisterForm";
import InquiryRegisterHeader from "../components/InquiryRegisterHeader/InquiryRegisterHeader";
import InquiryRegisterNotice from "../components/InquiryRegisterNotice/InquiryRegisterNotice";
import { useGetCategories } from "../hooks/useGetCategories";
import { useCreateInquiryMutation } from "../hooks/useInquiryMutation/useCreateInquiryMutation";

import Divider from "@/common/components/Divider/Divider";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useImagePicker } from "@/common/hooks/useImagePicker";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useMypageNavigation } from "@/common/router";

export default function InquiryRegisterView() {
  const navigation = useMypageNavigation();
  const { hide: hideBottomTab, show: showBottomTab } = useBottomTab();

  useEffect(() => {
    hideBottomTab();
    return () => showBottomTab();
  }, [hideBottomTab, showBottomTab]);

  const [form, setForm] = useState({
    type: "",
    detailType: "",
    content: "",
  });

  const { imageUrls, handleAddImage, handleRemoveImage } = useImagePicker({
    maxCount: 10,
    allowsMultipleSelection: true,
  });
  const { data: categories } = useGetCategories();

  const { mutateAsync: createInquiry, isPending: isCreating } = useCreateInquiryMutation();
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();
  const isSubmitEnabled =
    !!form.type && !!form.detailType && form.content.length >= 20 && !isCreating && !isUploading;

  const handlePressBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePressSubmit = useCallback(async () => {
    try {
      let finalImageUrls = imageUrls;

      if (imageUrls.length > 0) {
        // TODO: 백엔드에 INQUIRY 타입 추가되면 'REVIEW' -> 'INQUIRY'로 변경
        finalImageUrls = await uploadImages({ localUris: imageUrls, type: "REVIEW" });
      }

      await createInquiry({ ...form, imageUrls: finalImageUrls });

      toast.show("1:1 문의가 접수되었습니다.");
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      console.error("에러 응답:", JSON.stringify(error?.response?.data));
      toast.show("문의 등록 중 오류가 발생했습니다.");
    }
  }, [createInquiry, uploadImages, form, imageUrls, navigation]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <InquiryRegisterHeader wrapperClassName="px-20" onPressBack={handlePressBack} />
          <InquiryRegisterForm
            categories={categories}
            form={form}
            onChangeForm={setForm}
            imageUrls={imageUrls}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
          />
          <Divider height={10} wrapperClassName="bg-gray1" />
          <InquiryRegisterNotice />
        </ScrollView>
        <InquiryRegisterActions
          isSubmitEnabled={isSubmitEnabled}
          onPressCancel={handlePressBack}
          onPressSubmit={handlePressSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
