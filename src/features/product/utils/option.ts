import { DropdownItem } from "@/common/components/Dropdown/Dropdown";
import { OptionGroup, Variant } from "@/features/product/types/product";

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

export function parseOption(optionGroup: OptionGroup, enabledVariants: Array<Variant>): Array<DropdownItem> {
  return optionGroup.options.map(option => ({
    label: `${option.name}${option.price > 0 ? ` (+${option.price.toLocaleString()}원)` : ""}`,
    value: option.optionId.toString(),
    disabled: !enabledVariants.some(variant => variant.optionIds.includes(option.optionId)),
  }));
}

export function getNextOptionGroupIds(
  optionGroups: Array<OptionGroup>,
  optionGroupId: number
): Array<number> {
  const curIndex = optionGroups.findIndex(optionGroup => optionGroup.optionGroupId === optionGroupId);

  return optionGroups.slice(curIndex + 1).map(optionGroup => optionGroup.optionGroupId);
}
