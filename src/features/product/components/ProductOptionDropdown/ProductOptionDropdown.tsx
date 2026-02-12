import { produce } from "immer";
import { useCallback, useMemo } from "react";

import Dropdown from "@/common/components/Dropdown/Dropdown";
import { toast } from "@/common/providers/ToastProvider";
import { useGetStock } from "@/features/product/hooks/useGetStock";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants, getNextOptionGroupIds, parseOption } from "@/features/product/utils/option";

interface ProductOptionDropdownProps {
  optionGroup: OptionGroup;
  index: number;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  selectedOptions: Record<number, number>;
  onChangeOption: (optionGroupId: number, optionId: number) => void;
  productId: number;
}

export default function ProductOptionDropdown(props: ProductOptionDropdownProps) {
  const { optionGroup, index, optionGroups, variants, selectedOptions, onChangeOption, productId } = props;
  const isLast = index === optionGroups.length - 1;
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

  const enabledVariantIds = useMemo(() => enabledVariants.map(v => v.variantId), [enabledVariants]);
  const { data: stockResponse } = useGetStock(productId, enabledVariantIds, isLast);

  const isDisabled = index > 0 && Object.keys(selectedOptions).length === 0;

  const dropdownItems = useMemo(
    () => parseOption(optionGroup, enabledVariants, stockResponse?.variants ?? [], isLast),
    [enabledVariants, optionGroup, stockResponse, isLast]
  );

  const handleChangeOption = useCallback(
    (optionIdStr: string) => {
      const optionId = Number(optionIdStr);
      const targetItem = dropdownItems.find(item => item.value === optionIdStr);

      // TODO : 조합 불가능한 옵션 및 품절 옵션 선택 시 표출 정책 논의
      if (targetItem?.disabled) {
        toast.show("선택할 수 없는 옵션입니다.");
        return;
      }
      onChangeOption(optionGroup.optionGroupId, optionId);
    },
    [dropdownItems, onChangeOption, optionGroup.optionGroupId]
  );

  return (
    <Dropdown
      id={optionGroup.optionGroupId.toString()}
      placeholder={`(${optionGroup.name})옵션을 선택해 보세요`}
      value={selectedOptions[optionGroup.optionGroupId]?.toString() || ""}
      onChange={handleChangeOption}
      key={optionGroup.optionGroupId}
      items={dropdownItems}
      disabled={isDisabled}
      closeOnDisabled={false}
    />
  );
}
