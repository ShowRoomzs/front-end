import { DropdownItem } from "@/common/components/Dropdown/Dropdown";
import { OptionGroup } from "@/features/product/types/product";

export function parseOption(optionGroup: OptionGroup): Array<DropdownItem> {
  return optionGroup.options.map(option => ({
    label: `${option.name}${option.price > 0 ? ` (+${option.price.toLocaleString()}원)` : ""}`,
    value: option.optionId.toString(),
  }));
}
