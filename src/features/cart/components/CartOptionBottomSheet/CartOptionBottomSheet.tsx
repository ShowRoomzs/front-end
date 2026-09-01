import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { produce } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { toast } from "@/common/providers/ToastProvider";
import {
  BOTTOM_SHEET_GAP,
  PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
} from "@/features/product/components/ProductOptionBottomSheet/config";
import ProductOptionDropdown from "@/features/product/components/ProductOptionDropdown/ProductOptionDropdown";
import VariantCard from "@/features/product/components/VariantCard/VariantCard";
import { PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT } from "@/features/product/constants/optionBottomSheet";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useOptionSelection } from "@/features/product/hooks/useOptionSelection";
import { LocalVariant } from "@/features/product/types/product";
import { getEnabledVariants } from "@/features/product/utils/option";

interface CartOptionBottomSheetProps {
  sheetApi?: SheetApi;
  cartId: number;
  productId: number;
  variantId: number;
  quantity: number;
  onConfirm: (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => void;
}

export default function CartOptionBottomSheet(props: CartOptionBottomSheetProps) {
  const { cartId, productId, variantId, quantity, sheetApi, onConfirm } = props;
  const { bottom } = useSafeAreaInsets();
  const { data: productDetail } = useGetProductDetail(productId);
  const [footerHeight, setFooterHeight] = useState(0);

  // productDetail의 variants에서 variantId로 찾아서 초기 옵션 매핑
  const initialSelectedOptions = useMemo(() => {
    if (!productDetail) {
      return {};
    }

    const targetVariant = productDetail.variants.find(v => v.variantId === variantId);

    if (!targetVariant) {
      return {};
    }

    const options: Record<number, number> = {};

    productDetail.optionGroups.forEach(group => {
      const matchedOption = group.options.find(opt => targetVariant.optionIds.includes(opt.optionId));

      if (matchedOption) {
        options[group.optionGroupId] = matchedOption.optionId;
      }
    });

    return options;
  }, [productDetail, variantId]);

  const { selectedOptions, openGroupId, handleToggleGroup, handleChangeOption } = useOptionSelection({
    optionGroups: productDetail?.optionGroups ?? [],
    initialSelectedOptions,
  });

  const [selectedVariants, setSelectedVariants] = useState<Array<LocalVariant>>([]);

  useEffect(() => {
    if (!productDetail || !initialSelectedOptions || Object.keys(initialSelectedOptions).length === 0) {
      return;
    }

    const targetVariant = productDetail.variants.find(v => v.variantId === variantId);

    if (!targetVariant) {
      return;
    }

    setSelectedVariants([{ ...targetVariant, count: quantity }]);
  }, [productDetail, variantId, quantity, initialSelectedOptions]);

  const handleChangeOptionInternal = useCallback(
    (optionGroupId: number, optionId: number) => {
      if (!productDetail) {
        return;
      }

      const newSelectOptions = handleChangeOption(optionGroupId, optionId);

      if (Object.keys(newSelectOptions).length === productDetail.optionGroups.length) {
        const targetVariant = getEnabledVariants(productDetail.variants, newSelectOptions)[0];

        const newVariants = produce(selectedVariants, draft => {
          const exist = draft.find(v => v.variantId === targetVariant.variantId);

          if (exist) {
            exist.count += 1;
            return;
          }

          return [...draft, { ...targetVariant, count: 1 }];
        });

        setSelectedVariants(newVariants);
      }
    },
    [productDetail, selectedVariants, handleChangeOption]
  );

  const handleChangeVariantCount = useCallback(
    (variantId: number, count: number) => {
      const newVariants = selectedVariants.map(variant =>
        variant.variantId === variantId ? { ...variant, count } : variant
      );

      setSelectedVariants(newVariants);
    },
    [selectedVariants]
  );

  const handleRemoveVariant = useCallback(
    (variantId: number) => {
      const newVariants = selectedVariants.filter(variant => variant.variantId !== variantId);

      setSelectedVariants(newVariants);
    },
    [selectedVariants]
  );

  const totalPrice = useMemo(
    () => selectedVariants.reduce((sum, variant) => sum + variant.salePrice * variant.count, 0),
    [selectedVariants]
  );

  const hasSelectedVariants = useMemo(() => selectedVariants.length > 0, [selectedVariants]);

  const handlePressCancel = useCallback(() => {
    sheetApi?.close();
  }, [sheetApi]);

  const handlePressConfirm = useCallback(() => {
    if (!hasSelectedVariants) {
      toast.show("옵션을 선택해 주세요.");
      return;
    }

    // 여러 variant 중 첫 번째 것만 전달 (장바구니는 개별 아이템 단위 수정)
    const targetVariant = selectedVariants[0];

    onConfirm(cartId, targetVariant.variantId, targetVariant.count, sheetApi);
  }, [hasSelectedVariants, selectedVariants, cartId, onConfirm, sheetApi]);

  if (!productDetail) {
    return null;
  }

  return (
    <View style={{ maxHeight: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT }}>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: BOTTOM_SHEET_GAP + footerHeight,
        }}
      >
        <VStack gap={BOTTOM_SHEET_GAP} className="px-20">
          {productDetail.optionGroups.map((optionGroup, ix) => (
            <ProductOptionDropdown
              key={optionGroup.optionGroupId}
              optionGroup={optionGroup}
              index={ix}
              optionGroups={productDetail.optionGroups}
              variants={productDetail.variants}
              selectedOptions={selectedOptions}
              openGroupId={openGroupId}
              onToggleGroup={handleToggleGroup}
              onChangeOption={handleChangeOptionInternal}
              productId={productId}
            />
          ))}
          {selectedVariants.map(variant => (
            <VariantCard
              key={variant.variantId}
              variant={variant}
              onRemove={() => handleRemoveVariant(variant.variantId)}
              onChangeCount={count => handleChangeVariantCount(variant.variantId, count)}
            />
          ))}
        </VStack>
      </BottomSheetScrollView>
      <View
        onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
        className="absolute bottom-0 left-0 right-0 bg-white"
        style={{ paddingBottom: bottom + PRODUCT_OPTION_BOTTOM_SHEET_PADDING }}
      >
        {hasSelectedVariants && (
          <View className="px-10 p-20 border-t-[1px] border-gray2 flex flex-row items-center justify-between">
            <Typography className="text-14 text-gray10 font-normal">총 결제 금액.</Typography>
            <Typography className="text-black text-16 font-semibold">
              ₩ {totalPrice.toLocaleString()}
            </Typography>
          </View>
        )}
        <HStack gap={6} className="px-10 flex flex-row items-center pt-10">
          <Button onPress={handlePressCancel} size="xl" variant="secondary" className="py-15 flex-1">
            취소
          </Button>
          <Button
            disabled={!hasSelectedVariants}
            onPress={handlePressConfirm}
            size="xl"
            variant="primary"
            className="py-15 flex-1"
          >
            변경하기
          </Button>
        </HStack>
      </View>
    </View>
  );
}
