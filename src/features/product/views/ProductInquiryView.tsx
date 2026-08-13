import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { isDeepEqual } from "remeda";

import Divider from "@/common/components/Divider/Divider";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductInquiryActions from "@/features/product/components/ProductInquiryActions/ProductInquiryActions";
import ProductInquiryForm from "@/features/product/components/ProductInquiryForm/ProductInquiryForm";
import ProductInquiryHeader from "@/features/product/components/ProductInquiryHeader/ProductInquiryHeader";
import ProductInquiryNotice from "@/features/product/components/ProductInquiryNotice/ProductInquiryNotice";
import ProductInquiryProductDetail from "@/features/product/components/ProductInquiryProductDetail/ProductInquiryProductDetail";
import { useCreateProductInquiryMutation } from "@/features/product/hooks/useCreateProductInquiryMutation";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useGetProductInquiryDetail } from "@/features/product/hooks/useGetProductInquiryDetail";
import { useUpdateInquiryMutation } from "@/features/product/hooks/useUpdateInquiryMutation";
import { ProductInquiryRequest } from "@/features/product/types/productInquiry";

export default function ProductInquiryView() {
  const navigation = useCommonNavigation();

  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_INQUIRY>>();
  const { productId, inquiryId } = params;
  const isEdit = !!inquiryId;
  const { data: productDetail } = useGetProductDetail(productId);
  const { data: inquiryDetail } = useGetProductInquiryDetail(inquiryId);

  useEffect(() => {
    if (!inquiryDetail) {
      return;
    }
    setForm({
      type: inquiryDetail.type,
      content: inquiryDetail.content,
    });
  }, [inquiryDetail]);

  const { mutateAsync: createInquiry } = useCreateProductInquiryMutation();
  const { mutateAsync: updateInquiry } = useUpdateInquiryMutation(inquiryId!);

  const [form, setForm] = useState<ProductInquiryRequest>({ type: "", content: "" });

  const isFormValid = useMemo(() => {
    if (!isEdit || !inquiryDetail) {
      return form.type.length > 0 && form.content.length > 0;
    }

    return !isDeepEqual(form, { type: inquiryDetail.type, content: inquiryDetail.content });
  }, [form, inquiryDetail, isEdit]);

  const handleChangeType = useCallback((type: string) => {
    setForm(prev => ({ ...prev, type }));
  }, []);

  const handleChangeContent = useCallback((content: string) => {
    setForm(prev => ({ ...prev, content }));
  }, []);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressSubmit = usePermissionPress(async () => {
    const apiFn = isEdit ? updateInquiry(form) : createInquiry({ productId, data: form });

    try {
      await apiFn;
      toast.show(isEdit ? "수정되었습니다." : "문의가 접수되었습니다.");
      setForm({ type: "", content: "" });
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <ProductInquiryHeader wrapperClassName="px-20" onPressBack={handlePressBack} />
        <ProductInquiryProductDetail product={productDetail} />
        <ProductInquiryForm
          type={form.type}
          content={form.content}
          onChangeType={handleChangeType}
          onChangeContent={handleChangeContent}
        />
        <Divider height={10} wrapperClassName="bg-gray1" />
        <ProductInquiryNotice />
      </ScrollView>
      <ProductInquiryActions
        label={isEdit ? "수정하기" : "문의하기"}
        disabled={!isFormValid}
        onPress={handlePressSubmit}
      />
    </View>
  );
}
