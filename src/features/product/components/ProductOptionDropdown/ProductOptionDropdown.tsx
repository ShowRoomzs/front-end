import { produce } from "immer";
import { useMemo } from "react";

import { withObjectParticle } from "@/common/utils/withObjectParticle";
import ProductOptionSelect from "@/features/product/components/ProductOptionSelect/ProductOptionSelect";
import { useGetStock } from "@/features/product/hooks/useGetStock";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants, getNextOptionGroupIds, parseOption } from "@/features/product/utils/option";

interface ProductOptionDropdownProps {
  optionGroup: OptionGroup;
  index: number;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  selectedOptions: Record<number, number>;
  /** 지금 펼쳐져 있는 그룹 — 하나만 열린다 */
  openGroupId: number | null;
  onToggleGroup: (optionGroupId: number) => void;
  onChangeOption: (optionGroupId: number, optionId: number) => void;
  productId: number;
}

export default function ProductOptionDropdown(props: ProductOptionDropdownProps) {
  const {
    optionGroup,
    index,
    optionGroups,
    variants,
    selectedOptions,
    openGroupId,
    onToggleGroup,
    onChangeOption,
    productId,
  } = props;

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

  /**
   * 잠금은 **직전 그룹 하나**만 본다(시안 C7).
   *
   * 이전 구현은 "선택이 하나도 없으면 2번째부터 전부 잠금"이라, 1번을 고른 순간 3번까지
   * 함께 열려 2번을 건너뛴 조합을 만들 수 있었다.
   */
  const isLocked = index > 0 && selectedOptions[optionGroups[index - 1].optionGroupId] === undefined;

  const items = useMemo(
    () => parseOption(optionGroup, enabledVariants, stockResponse?.variants ?? [], isLast),
    [enabledVariants, optionGroup, stockResponse, isLast]
  );

  return (
    <ProductOptionSelect
      placeholder={`${withObjectParticle(optionGroup.name)} 선택해 주세요`}
      items={items}
      selectedOptionId={selectedOptions[optionGroup.optionGroupId]}
      isOpen={openGroupId === optionGroup.optionGroupId && !isLocked}
      isLocked={isLocked}
      onToggle={() => onToggleGroup(optionGroup.optionGroupId)}
      onSelect={optionId => onChangeOption(optionGroup.optionGroupId, optionId)}
    />
  );
}
