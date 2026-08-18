import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useState, useEffect, useMemo } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { isDeepEqual } from "remeda";

import InquiryRegisterActions from "../components/InquiryRegisterActions/InquiryRegisterActions";
import InquiryRegisterForm from "../components/InquiryRegisterForm/InquiryRegisterForm";
import InquiryRegisterNotice from "../components/InquiryRegisterNotice/InquiryRegisterNotice";
import { useGetCategories } from "../hooks/useGetCategories";
import { useGetInquiryDetail } from "../hooks/useGetInquiryDetail";
import { useCreateInquiryMutation } from "../hooks/useInquiryMutation/useCreateInquiryMutation";
import { useUpdateInquiryMutation } from "../hooks/useInquiryMutation/useUpdateInquiryMutation";
import { InquiryRequest } from "../types/inquiry";

import Divider from "@/common/components/Divider/Divider";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useImagePicker } from "@/common/hooks/useImagePicker";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";

export default function InquiryView() {
  const navigation = useMypageNavigation();
  const { params } = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.INQUIRY_REGISTER>>();
  const inquiryId = params?.inquiryId;
  const isEdit = !!inquiryId;

  const { hide: hideBottomTab, show: showBottomTab } = useBottomTab();
  const { data: inquiryDetail } = useGetInquiryDetail(inquiryId);

  useEffect(() => {
    hideBottomTab();
    return () => showBottomTab();
  }, [hideBottomTab, showBottomTab]);

  const [form, setForm] = useState<InquiryRequest>({ type: "", detailType: "", content: "" });
  const { imageUrls, handleAddImage, handleRemoveImage, setImageUrls } = useImagePicker({
    maxCount: 10,
    allowsMultipleSelection: true,
  });

  useEffect(() => {
    if (inquiryDetail) {
      setForm({
        type: inquiryDetail.type,
        detailType: inquiryDetail.detailType,
        content: inquiryDetail.content,
        orderId: inquiryDetail.orderId ?? undefined,
      });
      setImageUrls(inquiryDetail.imageUrls || []);
    }
  }, [inquiryDetail, setImageUrls]);

  const { data: categories } = useGetCategories();
  const { mutateAsync: createInquiry, isPending: isCreating } = useCreateInquiryMutation();
  const { mutateAsync: updateInquiry, isPending: isUpdating } = useUpdateInquiryMutation(inquiryId!);
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();

  const isFormValid = useMemo(() => {
    const hasRequiredFields = !!form.type && !!form.detailType && form.content.length >= 20;

    if (!isEdit || !inquiryDetail) {
      return hasRequiredFields && !isCreating;
    }

    const currentForm = { ...form, imageUrls };
    const originalForm = {
      type: inquiryDetail.type,
      detailType: inquiryDetail.detailType,
      content: inquiryDetail.content,
      imageUrls: inquiryDetail.imageUrls,
      orderId: inquiryDetail.orderId ?? undefined,
    };

    return !isDeepEqual(currentForm, originalForm) && !isUpdating;
  }, [form, inquiryDetail, isEdit, isCreating, isUpdating, imageUrls]);

  const handlePressBack = useCallback(() => navigation.goBack(), [navigation]);

  // TODO: 주문번호 조회 API 연동 후 handlePressOrderSearch에서 선택한 주문번호가 orderId로 설정되도록 변경 필요
  const handlePressSubmit = useCallback(async () => {
    try {
      const localUris = imageUrls.filter(url => url.startsWith("file://") || !url.startsWith("http"));
      const remoteUrls = imageUrls.filter(url => url.startsWith("http"));

      let uploadedUrls: string[] = [];
      if (localUris.length > 0) {
        uploadedUrls = await uploadImages({ localUris, type: "INQUIRY" });
      }

      const finalImageUrls = [...remoteUrls, ...uploadedUrls];
      const requestData = { ...form, imageUrls: finalImageUrls };

      if (isEdit) {
        await updateInquiry(requestData);
        toast.show("수정되었습니다.");
      } else {
        await createInquiry(requestData);
        toast.show("1:1 문의가 접수되었습니다.");
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      toast.show(isEdit ? "수정 중 오류가 발생했습니다." : "문의 등록 중 오류가 발생했습니다.");
    }
  }, [isEdit, updateInquiry, createInquiry, uploadImages, form, imageUrls, navigation]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <ScreenHeader title="1:1 문의하기" onPressBack={handlePressBack} />
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
          label={isEdit ? "수정하기" : "작성하기"}
          isSubmitEnabled={isFormValid && !isUploading}
          onPressCancel={handlePressBack}
          onPressSubmit={handlePressSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
