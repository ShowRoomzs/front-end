import { DropdownItem } from "@/common/components/Dropdown/Dropdown";
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

function getLabelSuffix(price: number, disabledWithStock: boolean) {
  if (disabledWithStock) {
    return " (품절)";
  }
  if (price > 0) {
    return ` (+${price.toLocaleString()}원)`;
  }
  return "";
}

export function parseOption(
  optionGroup: OptionGroup,
  enabledVariants: Array<Variant>,
  stocks: Array<Stock>,
  isLast: boolean
): Array<DropdownItem> {
  return optionGroup.options.map(option => {
    const targetVariant = enabledVariants.find(variant => variant.optionIds.includes(option.optionId));
    const targetStock = stocks.find(stock => stock.variantId === targetVariant?.variantId);

    // 조합 불가능한 옵션
    const disabledWithCombination = !enabledVariants.some(variant =>
      variant.optionIds.includes(option.optionId)
    );

    // 품절 옵션(마지막 옵션 그룹인 경우 품절 옵션 적용)
    const disabledWithStock = isLast ? targetStock?.isOutOfStock || targetStock?.isOutOfStockForced : false;

    return {
      label: `${option.name}${getLabelSuffix(option.price, disabledWithStock || false)}`,
      value: option.optionId.toString(),
      disabled: disabledWithCombination || disabledWithStock,
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
