import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isDeepEqual } from "remeda";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import FieldLabel from "@/common/components/FieldLabel/FieldLabel";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ImageUploader from "@/common/components/ImageUploader/ImageUploader";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SheetList, { SheetListItem } from "@/common/components/SheetList/SheetList";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useImagePicker } from "@/common/hooks/useImagePicker";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductInquiryProductCard from "@/features/product/components/ProductInquiryProductCard/ProductInquiryProductCard";
import { useCreateProductInquiryMutation } from "@/features/product/hooks/useCreateProductInquiryMutation";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useGetProductInquiryCategory } from "@/features/product/hooks/useGetProductInquiryCategory";
import { useGetProductInquiryDetail } from "@/features/product/hooks/useGetProductInquiryDetail";
import { useUpdateInquiryMutation } from "@/features/product/hooks/useUpdateInquiryMutation";
import { ProductInquiryRequest } from "@/features/product/types/productInquiry";

/**
 * C7-1 상품 문의 작성 — 상품 카드 → 유형 → 내용 → 비밀글 → 사진.
 *
 * **C12 1:1 문의와 답하는 주체가 다르다.** 여기는 상품에 대한 질문을 **브랜드**가 답하고 상품
 * 상세에 공개로 쌓인다. 주문·배송·환불은 운영팀이 답하는 C12로 보낸다 — 그래서 이 화면에는
 * 주문 연결이 없고, 대신 상품 카드가 상단에 고정된다.
 *
 * **공개 문의라 연락처를 적는 사고가 실제로 잦다.** 그 경고를 쓰기 전이 아니라 등록 버튼 앞,
 * 즉 보내기 직전에 읽히도록 뒀다.
 *
 * 등록 조건은 **유형 + 내용**이다. 비밀글과 사진은 선택이라 조건에서 뺀다.
 */
const CONTENT_MAX_LENGTH = 250;
const PHOTO_MAX_COUNT = 3;
const TYPE_SHEET_ID = "product-inquiry-type";

const CONTENT_PLACEHOLDER =
  "궁금한 점을 적어주세요. 사용하시는 피부 타입이나 상황을 함께 알려주시면 더 정확히 답변드릴 수 있어요.";

const NOTICES = [
  "답변은 브랜드가 직접 등록하며, 등록되면 알림으로 알려드려요. 주문·배송·환불 문의는 마이 탭의 1:1 문의를 이용해 주세요.",
  "연락처·주소 등 개인정보는 적지 말아 주세요. 공개 문의에 남긴 정보는 다른 이용자에게 보일 수 있습니다.",
  "욕설·비방·광고·타인의 개인정보가 담긴 문의는 사전 통보 없이 삭제될 수 있으며, 반복될 경우 문의 작성이 제한될 수 있습니다.",
];

const INITIAL_FORM: ProductInquiryRequest = { type: "", content: "", secret: false };

export default function ProductInquiryView() {
  const navigation = useCommonNavigation();
  const { bottom } = useSafeAreaInsets();
  // 시트 등록보다 먼저 닫기가 필요하므로 컨텍스트에서 직접 받는다
  const { close: closeTypeSheet } = useBottomSheetContext();

  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_INQUIRY>>();
  const { productId, inquiryId } = params;
  const isEdit = !!inquiryId;

  const { data: product } = useGetProductDetail(productId);
  const { data: inquiryDetail } = useGetProductInquiryDetail(inquiryId);
  const { data: categories } = useGetProductInquiryCategory();

  const [form, setForm] = useState<ProductInquiryRequest>(INITIAL_FORM);
  const { imageUrls, handleAddImage, handleRemoveImage, setImageUrls } = useImagePicker({
    maxCount: PHOTO_MAX_COUNT,
    allowsMultipleSelection: true,
  });

  const { mutateAsync: createInquiry, isPending: isCreating } = useCreateProductInquiryMutation();
  const { mutateAsync: updateInquiry, isPending: isUpdating } = useUpdateInquiryMutation(inquiryId!);
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();

  useEffect(() => {
    if (inquiryDetail) {
      setForm({
        type: inquiryDetail.type,
        content: inquiryDetail.content,
        secret: inquiryDetail.secret,
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

    // 수정은 바뀐 게 있을 때만 — 그대로 다시 보내면 답변 대기 순서만 흔든다.
    // secret은 비교에서 뺀다 — 서버가 수정으로는 받지 않는 값이라 바뀔 수 없다
    const current = { type: form.type, content: form.content, imageUrls };
    const original = {
      type: inquiryDetail.type,
      content: inquiryDetail.content,
      imageUrls: inquiryDetail.imageUrls,
    };

    return hasRequired && !isDeepEqual(current, original) && !isUpdating;
  }, [form, imageUrls, inquiryDetail, isCreating, isEdit, isUpdating]);

  const canSubmit = isSubmittable && !isUploading;

  const handlePressSubmit = usePermissionPress(async () => {
    try {
      // 새로 고른 사진만 올린다 — 수정에서 기존 사진까지 다시 올리면 URL이 바뀐다
      const localUris = imageUrls.filter(url => !url.startsWith("http"));
      const remoteUrls = imageUrls.filter(url => url.startsWith("http"));
      const uploadedUrls = localUris.length ? await uploadImages({ localUris, type: "INQUIRY" }) : [];

      const requestData: ProductInquiryRequest = {
        ...form,
        imageUrls: [...remoteUrls, ...uploadedUrls],
      };

      if (isEdit) {
        await updateInquiry(requestData);
        toast.show("문의가 수정되었습니다");
      } else {
        await createInquiry({ productId, data: requestData });
        toast.show("문의가 접수되었습니다");
      }
      navigation.goBack();
    } catch (error) {
      console.error("[productInquiry] 등록 실패", error);
      toast.show(isEdit ? "수정하지 못했어요. 잠시 후 다시 시도해 주세요" : "문의를 등록하지 못했어요");
    }
  });

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScreenHeader title="상품 문의" onPressBack={navigation.goBack} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ProductInquiryProductCard product={product} />

          <View className="px-14 pb-4 pt-20">
            <FieldLabel label="문의 유형" />
            <TouchableOpacity
              onPress={openTypeSheet}
              activeOpacity={0.6}
              className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
              style={{ marginTop: 9 }}
            >
              <Typography
                style={{ fontSize: 14, lineHeight: 14 }}
                className={selectedTypeLabel ? "text-ink" : "text-gray71"}
              >
                {selectedTypeLabel ?? "문의 유형을 선택해 주세요"}
              </Typography>
              <ChevronDownIcon size={14} color="#C7C7C7" />
            </TouchableOpacity>
          </View>

          <View className="px-14 pb-4 pt-16">
            <FieldLabel label="문의 내용" right={`${form.content.length}/${CONTENT_MAX_LENGTH}`} />
            <View
              className="rounded-base border-[1px] border-borderButton p-13"
              style={{ marginTop: 9, minHeight: 140 }}
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

          {/*
            비밀글은 답변이 달려도 공개로 바뀌지 않는다 — 목록에는 자물쇠와 대체 문구로 자리만 남는다.
            **수정에서는 잠근다.** 서버가 수정 요청에서 이 값을 받지 않으므로, 만질 수 있게 두면
            체크를 바꾸고 저장해도 아무 일이 없는 조용한 실패가 된다.
          */}
          <View className="px-14 pt-4">
            <TouchableOpacity
              onPress={() => setForm(prev => ({ ...prev, secret: !prev.secret }))}
              disabled={isEdit}
              activeOpacity={0.6}
              className="flex-row items-center py-8"
              style={{ gap: 10 }}
            >
              <Checkbox
                isChecked={!!form.secret}
                disabled={isEdit}
                onChange={() => setForm(prev => ({ ...prev, secret: !prev.secret }))}
              />
              <Typography
                style={{ fontSize: 13.5, fontWeight: "500", lineHeight: 13.5 }}
                className={isEdit ? "text-gray62" : "text-ink"}
              >
                비밀글로 문의하기
              </Typography>
            </TouchableOpacity>

            {isEdit && (
              <Typography style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 2 }} className="text-gray45">
                공개 여부는 등록한 뒤에는 바꿀 수 없어요
              </Typography>
            )}
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

          <View className="px-14" style={{ gap: 7, paddingTop: 18, paddingBottom: 26 }}>
            {NOTICES.map(notice => (
              <View key={notice} className="flex-row" style={{ gap: 7 }}>
                <Typography style={{ fontSize: 11, lineHeight: 18.7 }} className="flex-none text-gray45">
                  ·
                </Typography>
                <Typography style={{ fontSize: 11, lineHeight: 18.7 }} className="min-w-0 flex-1 text-gray45">
                  {notice}
                </Typography>
              </View>
            ))}
          </View>
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
