import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { produce } from "immer";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import Dropdown from "@/common/components/Dropdown/Dropdown";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import {
  BOTTOM_SHEET_GAP,
  PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT,
  PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
} from "@/features/product/components/ProductOptionBottomSheet/config";
import VariantCard from "@/features/product/components/VariantCard/VariantCard";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants, getNextOptionGroupIds, parseOption } from "@/features/product/utils/option";

// TODO : api 나오면 타입 수정 필요
export interface LocalVariant extends Variant {
  count: number;
}
interface ProductOptionBottomSheetProps {
  sheetApi?: SheetApi;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
}

export default function ProductOptionBottomSheet(props: ProductOptionBottomSheetProps) {
  const { optionGroups, variants, sheetApi } = props;
  const { bottom } = useSafeAreaInsets();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [selectedVariants, setSelectedVariants] = useState<Array<LocalVariant>>([]);
  const [footerHeight, setFooterHeight] = useState(0);
  const handleChangeOption = useCallback(
    (optionGroupId: number, optionId: number) => {
      // 현재 선택한 optionGroupId 이후의 optionGroupId들을 제거 (옵션 선택 순서 유지)
      const nextIds = getNextOptionGroupIds(optionGroups, optionGroupId);

      const newSelectOptions = produce(selectedOptions, draft => {
        draft[optionGroupId] = optionId;
        nextIds.forEach(id => {
          delete draft[id];
        });
      });

      // 모든 option이 선택된 경우 > 초기화 > selectedVariants 배열에 담음
      if (Object.keys(newSelectOptions).length === optionGroups.length) {
        setSelectedOptions({});
        // equals find
        const targetVariant = getEnabledVariants(variants, newSelectOptions)[0];

        setSelectedVariants(
          produce(draft => {
            const exist = draft.find(v => v.variantId === targetVariant.variantId);

            // 이미 존재하는 조합이라면 개수 증가
            if (exist) {
              exist.count += 1;
              return;
            }

            // 존재하지 않는 조합이라면 배열에 추가
            return [...draft, { ...targetVariant, count: 1 }];
          })
        );

        return;
      }
      setSelectedOptions(newSelectOptions);
    },
    [optionGroups, selectedOptions, variants]
  );

  const handleChangeVariantCount = useCallback((variantId: number, count: number) => {
    setSelectedVariants(prev =>
      prev.map(variant => (variant.variantId === variantId ? { ...variant, count } : variant))
    );
  }, []);

  const handleRemoveVariant = useCallback((variantId: number) => {
    setSelectedVariants(prev => prev.filter(variant => variant.variantId !== variantId));
  }, []);

  const totalPrice = useMemo(
    () => selectedVariants.reduce((sum, variant) => sum + variant.salePrice * variant.count, 0),
    [selectedVariants]
  );

  const hasSelectedVariants = useMemo(() => selectedVariants.length > 0, [selectedVariants]);

  return (
    <View
      onLayout={e => console.log(e.nativeEvent.layout.height)}
      style={{ maxHeight: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: BOTTOM_SHEET_GAP + footerHeight,
        }}
      >
        <VStack gap={BOTTOM_SHEET_GAP} className="px-20">
          {optionGroups.map((optionGroup, ix) => {
            const nextIds = getNextOptionGroupIds(optionGroups, optionGroup.optionGroupId);
            const selectedOptionsExcludingSelf = produce(selectedOptions, draft => {
              // 비교 대상 중 현재 optionGroupId 이후의 optionGroupId들을 제거 (옵션 선택 순서 유지)
              nextIds.forEach(id => {
                delete draft[id];
              });
              // 비교 대상 중 본인 optionGroupId 제거
              delete draft[optionGroup.optionGroupId];
            });
            const enabledVariants = getEnabledVariants(variants, selectedOptionsExcludingSelf);

            const isDisabled = ix > 0 && Object.keys(selectedOptions).length === 0;

            return (
              <Dropdown
                id={optionGroup.optionGroupId.toString()}
                placeholder={`(${optionGroup.name})옵션을 선택해 보세요`}
                value={selectedOptions[optionGroup.optionGroupId]?.toString() || ""}
                onChange={optionId => handleChangeOption(optionGroup.optionGroupId, Number(optionId))}
                key={optionGroup.optionGroupId}
                items={parseOption(optionGroup, enabledVariants)}
                disabled={isDisabled}
              />
            );
          })}
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
        <View className="px-10 p-20 border-t-[1px] border-gray2 flex flex-row items-center justify-between">
          <Typography className="text-14 text-gray10 font-normal">총 결제 금액.</Typography>
          <Typography className="text-black text-16 font-semibold">
            ₩ {totalPrice.toLocaleString()}
          </Typography>
        </View>
        <HStack gap={6} className="px-10 flex flex-row items-center pt-10">
          <Button disabled={!hasSelectedVariants} size="xl" variant="secondary" className="py-15 flex-1">
            장바구니
          </Button>
          <Button disabled={!hasSelectedVariants} size="xl" variant="primary" className="py-15 flex-1">
            구매하기
          </Button>
        </HStack>
      </View>
    </View>
  );
}
