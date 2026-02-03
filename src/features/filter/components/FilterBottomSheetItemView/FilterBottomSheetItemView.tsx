import { useCallback } from "react";
import { View } from "react-native";

import { cn } from "@/common/utils/cn";
import FilterColorView from "@/features/filter/components/FilterBottomSheetItemView/FilterColorView";
import FilterRadioView from "@/features/filter/components/FilterBottomSheetItemView/FilterRadioView";
import FilterSelectView from "@/features/filter/components/FilterBottomSheetItemView/FilterSelectView";
import { Filter } from "@/features/filter/types/filter";

interface FilterBottomSheetItemViewProps {
  filter: Filter;
  className?: string;
  selectedValues: Array<string>;
  onChange: (filterId: number, value: string) => void;
}
export default function FilterBottomSheetItemView(props: FilterBottomSheetItemViewProps) {
  const { filter, className, selectedValues, onChange } = props;

  const handleChange = useCallback(
    (value: string) => {
      onChange(filter.id, value);
    },
    [onChange, filter.id]
  );

  const renderContent = useCallback(
    (filter: Filter) => {
      const { filterType } = filter;

      switch (filterType) {
        case "SELECT":
          return <FilterSelectView filter={filter} selectedValues={selectedValues} onChange={handleChange} />;
        case "RADIO":
          return <FilterRadioView filter={filter} selectedValues={selectedValues} onChange={handleChange} />;
        case "COLOR":
          return <FilterColorView filter={filter} selectedValues={selectedValues} onChange={handleChange} />;
        default:
          return null;
      }
    },
    [handleChange, selectedValues]
  );

  return <View className={cn("p-20 h-full", className)}>{renderContent(filter)}</View>;
}
