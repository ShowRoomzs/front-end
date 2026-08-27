import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isDeepEqual } from "remeda";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import FieldLabel from "@/common/components/FieldLabel/FieldLabel";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ImageUploader from "@/common/components/ImageUploader/ImageUploader";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SheetList, { SheetListItem } from "@/common/components/SheetList/SheetList";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useImagePicker } from "@/common/hooks/useImagePicker";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import InquiryOrderField from "@/features/inquiry/components/InquiryOrderField/InquiryOrderField";
import { useGetCategories } from "@/features/inquiry/hooks/useGetCategories";
import { useGetInquiryDetail } from "@/features/inquiry/hooks/useGetInquiryDetail";
import { useCreateInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useCreateInquiryMutation";
import { useUpdateInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useUpdateInquiryMutation";
import { InquiryRequest } from "@/features/inquiry/types/inquiry";

/**
 * C12 1:1 문의 작성 — 유형 → 내용 → 사진 첨부.
 *
 * **유형을 먼저 받는 이유**는 담당 배정과 응답 시간이 유형에 따라 달라지고, 유형별로 필요한
 * 정보를 안내할 수 있기 때문이다. 유형은 고객센터 FAQ와 **같은 5종**(CsCategory)이라
 * 사용자가 같은 분류를 두 번 배우지 않는다.
 *
 * **관련 주문은 아직 고를 수 없다** — 주문 목록 조회 API가 없어서다. 칸은 남기고 눌렀을 때
 * 준비 중임을 알린다(자세한 사정은 `InquiryOrderField`).
 *
 * 등록 조건은 **유형 + 내용**이다. 사진은 선택이라 조건에서 제외한다.
 */
const CONTENT_MAX_LENGTH = 1000;
const PHOTO_MAX_COUNT = 5;
const TYPE_SHEET_ID = "inquiry-type";

const CONTENT_PLACEHOLDER =
  "문의하실 내용을 자세히 적어주세요. 주문번호나 상품명을 함께 알려주시면 더 빠르게 확인할 수 있어요.";

const INITIAL_FORM: InquiryRequest = { type: "", content: "" };

export default function InquiryView() {
  const navigation = useMypageNavigation();
  const { bottom } = useSafeAreaInsets();
  // 시트 등록보다 먼저 닫기가 필요하므로 컨텍스트에서 직접 받는다
  const { close: closeTypeSheet } = useBottomSheetContext();
  const { params } = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.INQUIRY_REGISTER>>();
  const inquiryId = params?.inquiryId;
  const isEdit = !!inquiryId;

  const { data: inquiryDetail } = useGetInquiryDetail(inquiryId);
  const { data: categories } = useGetCategories();

  const [form, setForm] = useState<InquiryRequest>(INITIAL_FORM);
  const { imageUrls, handleAddImage, handleRemoveImage, setImageUrls } = useImagePicker({
    maxCount: PHOTO_MAX_COUNT,
    allowsMultipleSelection: true,
  });

  const { mutateAsync: createInquiry, isPending: isCreating } = useCreateInquiryMutation();
  const { mutateAsync: updateInquiry, isPending: isUpdating } = useUpdateInquiryMutation(inquiryId!);
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();

  useEffect(() => {
    if (inquiryDetail) {
      setForm({
        type: inquiryDetail.type,
        content: inquiryDetail.content,
        orderId: inquiryDetail.orderId ?? undefined,
      });
      setImageUrls(inquiryDetail.imageUrls ?? []);
    }
  }, [inquiryDetail, setImageUrls]);

  const typeItems = useMemo<Array<SheetListItem<string>>>(
    () => (categories ?? []).map(category => ({ value: category.key, label: category.description })),
    [categories]
  );

  const selectedTypeLabel = useMemo(
    () => categories?.find(category => category.key === form.type)?.description,
    [categories, form.type]
  );

  /** 고르는 즉시 닫는다 — 단일 선택이라 확인 단계를 둘 이유가 없다 */
  const handleSelectType = useCallback(
    (type: string) => {
      setForm(prev => ({ ...prev, type }));
      closeTypeSheet();
    },
    [closeTypeSheet]
  );

  const { open: openTypeSheet } = useBottomSheet({
    id: TYPE_SHEET_ID,
    render: (
      <SheetList
        title="문의 유형"
        items={typeItems}
        mode="select"
        selectedValue={form.type}
        onSelect={handleSelectType}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const isSubmittable = useMemo(() => {
    const hasRequired = !!form.type && form.content.trim().length > 0;

    if (!isEdit || !inquiryDetail) {
      return hasRequired && !isCreating;
    }

    // 수정은 바뀐 게 있을 때만 — 그대로 다시 보내면 답변 대기 순서만 흔든다
    const current = { type: form.type, content: form.content, imageUrls };
    const original = {
      type: inquiryDetail.type,
      content: inquiryDetail.content,
      imageUrls: inquiryDetail.imageUrls,
    };

    return hasRequired && !isDeepEqual(current, original) && !isUpdating;
  }, [form, imageUrls, inquiryDetail, isCreating, isEdit, isUpdating]);

  const canSubmit = isSubmittable && !isUploading;

  const handlePressSubmit = useCallback(async () => {
    try {
      // 새로 고른 사진만 올린다 — 수정에서 기존 사진까지 다시 올리면 URL이 바뀐다
      const localUris = imageUrls.filter(url => !url.startsWith("http"));
      const remoteUrls = imageUrls.filter(url => url.startsWith("http"));
      const uploadedUrls = localUris.length ? await uploadImages({ localUris, type: "INQUIRY" }) : [];

      const requestData: InquiryRequest = { ...form, imageUrls: [...remoteUrls, ...uploadedUrls] };

      if (isEdit) {
        await updateInquiry(requestData);
        toast.show("문의가 수정되었습니다");
      } else {
        await createInquiry(requestData);
        toast.show("1:1 문의가 접수되었습니다");
      }
      navigation.goBack();
    } catch (error) {
      console.error("[inquiry] 등록 실패", error);
      toast.show(isEdit ? "수정하지 못했어요. 잠시 후 다시 시도해 주세요" : "문의를 등록하지 못했어요");
    }
  }, [createInquiry, form, imageUrls, isEdit, navigation, updateInquiry, uploadImages]);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScreenHeader title="1:1 문의" onPressBack={navigation.goBack} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="px-14 pb-4 pt-20">
            <FieldLabel label="문의 유형" />
            <TouchableOpacity
              onPress={openTypeSheet}
              activeOpacity={0.6}
              className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
              style={{ marginTop: 9 }}
            >
              <Typography
                style={{ fontSize: 15, lineHeight: 15 }}
                className={selectedTypeLabel ? "text-ink" : "text-gray71"}
              >
                {selectedTypeLabel ?? "문의 유형을 선택해 주세요"}
              </Typography>
              <ChevronDownIcon size={14} color="#C7C7C7" />
            </TouchableOpacity>
          </View>

          <View className="px-14 pb-4 pt-16">
            <InquiryOrderField />
          </View>

          <View className="px-14 pb-4 pt-16">
            <FieldLabel label="문의 내용" right={`${form.content.length}/${CONTENT_MAX_LENGTH}`} />
            <View
              className="rounded-base border-[1px] border-borderButton p-13"
              style={{ marginTop: 9, minHeight: 150 }}
            >
              <TextInput
                value={form.content}
                onChangeText={content => setForm(prev => ({ ...prev, content }))}
                placeholder={CONTENT_PLACEHOLDER}
                placeholderTextColor="#B5B5B5"
                maxLength={CONTENT_MAX_LENGTH}
                multiline
                className="m-0 flex-1 p-0 text-ink"
                style={{ fontSize: 14, lineHeight: 23.8, textAlignVertical: "top" }}
              />
            </View>
          </View>

          <View className="px-14 pb-4 pt-8">
            <FieldLabel label="사진 첨부" optional />
            <View style={{ marginTop: 10 }}>
              <ImageUploader
                imageUrls={imageUrls}
                maxCount={PHOTO_MAX_COUNT}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
              />
            </View>
          </View>

          <View style={{ marginTop: 22 }}>
            <GroupBand height={5} />
          </View>

          <Typography
            style={{ fontSize: 11.5, lineHeight: 19.55, paddingTop: 18, paddingBottom: 26 }}
            className="px-14 text-gray45"
          >
            {
              "답변은 평일 10:00–18:00에 순차로 등록되고, 등록되면 알림으로 알려드려요. 문의 내역은 마이 탭 > 문의 내역에서 확인할 수 있어요."
            }
          </Typography>
        </ScrollView>

        <View
          className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
          style={{ paddingBottom: bottom + 26 }}
        >
          <TouchableOpacity
            onPress={handlePressSubmit}
            disabled={!canSubmit}
            activeOpacity={0.75}
            className={`h-52 flex-row items-center justify-center rounded-base ${
              canSubmit ? "bg-rose" : "bg-fill"
            }`}
          >
            <Typography variant="buttonPrimary" className={canSubmit ? "text-white" : "text-gray71"}>
              {isEdit ? "문의 수정" : "문의 등록"}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
