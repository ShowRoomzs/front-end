import { BottomSheetView } from "@gorhom/bottom-sheet";
import { produce } from "immer";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Dropdown from "@/common/components/Dropdown/Dropdown";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { PRODUCT_OPTION_BOTTOM_SHEET_PADDING } from "@/features/product/components/ProductOptionBottomSheet/config";
import VariantCard from "@/features/product/components/VariantCard/VariantCard";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants, getNextOptionGroupIds, parseOption } from "@/features/product/utils/option";

// TODO : api 나오면 타입 수정 필요
interface LocalVariant extends Variant {
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
        const enabledVariants = getEnabledVariants(variants, newSelectOptions);

        setSelectedVariants(prev => [
          ...prev,
          ...enabledVariants.map(v => ({
            ...v,
            count: 1,
          })),
        ]);
        return;
      }
      setSelectedOptions(newSelectOptions);
    },
    [optionGroups, selectedOptions, variants]
  );

  return (
    <BottomSheetView>
      <VStack
        gap={20}
        style={{
          paddingBottom: bottom + PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
          paddingTop: PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
        }}
        className="px-20 pt-15"
      >
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
            count={variant.count}
            onRemove={() => {}}
            onChangeCount={() => {}}
          />
        ))}
      </VStack>
    </BottomSheetView>
  );
}
