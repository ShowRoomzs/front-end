import { OptionGroup, Stock, Variant } from "@/features/product/types/product";

// 특정한 option값들로 조합 가능한 variants 필터링 (사용자가 선택한 option값들로 조합 가능한 variants)
export function getEnabledVariants(
  variants: Array<Variant>,
  selectedOptions: Record<number, number>
): Array<Variant> {
  if (!Object.keys(selectedOptions).length) {
    return variants;
  }
  const optionIds = Object.values(selectedOptions).map(Number);

  return variants.filter(variant => optionIds.every(optionId => variant.optionIds.includes(optionId)));
}

/**
 * 시안 C7의 옵션 항목 한 줄.
 *
 * 추가금과 품절을 **라벨 문자열에 붙이지 않는다** — 시안은 셋을 다른 자리·다른 서체로 그린다.
 * 라벨은 좌측, 추가금은 우측 끝 12.5/#737373, 품절은 그 자리에 12/600 #9E9E9E다.
 * 문자열로 이어 붙이면 이 배치를 만들 수 없고, 라벨이 길 때 말줄임이 추가금부터 먹는다.
 */
export interface ProductOptionItem {
  optionId: number;
  label: string;
  /** 0이면 표시하지 않는다 */
  extraPrice: number;
  /** 재고 0 또는 강제 품절 — 목록에서 지우지 않고 남긴다(§C7 옵션 단위 품절) */
  isSoldOut: boolean;
}

export function parseOption(
  optionGroup: OptionGroup,
  enabledVariants: Array<Variant>,
  stocks: Array<Stock>,
  isLast: boolean
): Array<ProductOptionItem> {
  const filteredOptions = optionGroup.options.filter(option => {
    // 조합 불가능한 옵션
    const disabledWithCombination = !enabledVariants.some(variant =>
      variant.optionIds.includes(option.optionId)
    );

    return !disabledWithCombination;
  });

  return filteredOptions.map(option => {
    const targetVariant = enabledVariants.find(variant => variant.optionIds.includes(option.optionId));
    const targetStock = stocks.find(stock => stock.variantId === targetVariant?.variantId);

    // 품절 옵션(마지막 옵션 그룹인 경우 품절 옵션 적용)
    const disabledWithStock = isLast ? targetStock?.isOutOfStock || targetStock?.isOutOfStockForced : false;

    return {
      optionId: option.optionId,
      label: option.name,
      extraPrice: option.price,
      isSoldOut: disabledWithStock || false,
    };
  });
}

export function getNextOptionGroupIds(
  optionGroups: Array<OptionGroup>,
  optionGroupId: number
): Array<number> {
  const curIndex = optionGroups.findIndex(optionGroup => optionGroup.optionGroupId === optionGroupId);

  return optionGroups.slice(curIndex + 1).map(optionGroup => optionGroup.optionGroupId);
}
