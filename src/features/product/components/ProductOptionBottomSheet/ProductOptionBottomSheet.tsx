import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { produce } from "immer";
import { useCallback, useMemo, useState } from "react";
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
import { useOptionSelection } from "@/features/product/hooks/useOptionSelection";
import { useProductVariantSelection } from "@/features/product/stores/useProductVariantSelection";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants } from "@/features/product/utils/option";

interface ProductOptionBottomSheetProps {
  sheetApi?: SheetApi;
  productId: number;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  onPressCart: (sheetApi?: SheetApi) => void;
  onPressBuy: () => void;
}

export default function ProductOptionBottomSheet(props: ProductOptionBottomSheetProps) {
  const { productId, optionGroups, variants, sheetApi, onPressCart, onPressBuy } = props;
  const { bottom } = useSafeAreaInsets();
  const { selectedVariantsByProductId, setSelectedVariants } = useProductVariantSelection();
  const { selectedOptions, handleChangeOption } = useOptionSelection({ optionGroups });
  const [footerHeight, setFooterHeight] = useState(0);

  const selectedVariants = useMemo(
    () => selectedVariantsByProductId[productId] || [],
    [selectedVariantsByProductId, productId]
  );

  const handleChangeOptionInternal = useCallback(
    (optionGroupId: number, optionId: number) => {
      const newSelectOptions = handleChangeOption(optionGroupId, optionId);

      // 모든 option이 선택된 경우 > selectedVariants 배열에 담음
      if (Object.keys(newSelectOptions).length === optionGroups.length) {
        const targetVariant = getEnabledVariants(variants, newSelectOptions)[0];

        const newVariants = produce(selectedVariants, draft => {
          const exist = draft.find(v => v.variantId === targetVariant.variantId);

          // 이미 존재하는 조합이라면 개수 증가
          if (exist) {
            exist.count += 1;
            return;
          }

          // 존재하지 않는 조합이라면 배열에 추가
          return [...draft, { ...targetVariant, count: 1 }];
        });

        setSelectedVariants(productId, newVariants);
      }
    },
    [productId, optionGroups, selectedVariants, setSelectedVariants, variants, handleChangeOption]
  );

  const handleChangeVariantCount = useCallback(
    (variantId: number, count: number) => {
      const newVariants = selectedVariants.map(variant =>
        variant.variantId === variantId ? { ...variant, count } : variant
      );

      setSelectedVariants(productId, newVariants);
    },
    [productId, selectedVariants, setSelectedVariants]
  );

  const handleRemoveVariant = useCallback(
    (variantId: number) => {
      const newVariants = selectedVariants.filter(variant => variant.variantId !== variantId);

      setSelectedVariants(productId, newVariants);
    },
    [productId, selectedVariants, setSelectedVariants]
  );

  const totalPrice = useMemo(
    () => selectedVariants.reduce((sum, variant) => sum + variant.salePrice * variant.count, 0),
    [selectedVariants]
  );

  const hasSelectedVariants = useMemo(() => selectedVariants.length > 0, [selectedVariants]);

  const handlePressCart = useCallback(() => {
    if (!hasSelectedVariants) {
      toast.show("옵션을 선택해 주세요.");
      return;
    }
    onPressCart(sheetApi);
  }, [hasSelectedVariants, onPressCart, sheetApi]);

  const handlePressBuy = useCallback(() => {
    if (!hasSelectedVariants) {
      toast.show("옵션을 선택해 주세요.");
      return;
    }
    sheetApi?.close();
    onPressBuy();
  }, [hasSelectedVariants, onPressBuy, sheetApi]);

  return (
    <View style={{ maxHeight: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT }}>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: BOTTOM_SHEET_GAP + footerHeight,
        }}
      >
        <VStack gap={BOTTOM_SHEET_GAP} className="px-20">
          {optionGroups.map((optionGroup, ix) => (
            <ProductOptionDropdown
              key={optionGroup.optionGroupId}
              optionGroup={optionGroup}
              index={ix}
              optionGroups={optionGroups}
              variants={variants}
              selectedOptions={selectedOptions}
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
          <Button onPress={handlePressCart} size="xl" variant="secondary" className="py-15 flex-1">
            장바구니
          </Button>
          <Button onPress={handlePressBuy} size="xl" variant="primary" className="py-15 flex-1">
            구매하기
          </Button>
        </HStack>
      </View>
    </View>
  );
}
