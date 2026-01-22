import { useCallback } from "react";
import { View } from "react-native";

import { cn } from "@/common/utils/cn";
import FilterSelectView from "@/features/category/components/FilterBottomSheetItemView/FilterSelectView";
import { Filter } from "@/features/category/types/category";

interface FilterBottomSheetItemViewProps {
  filter: Filter;
  className?: string;
}
export default function FilterBottomSheetItemView(props: FilterBottomSheetItemViewProps) {
  const { filter, className } = props;

  const renderContent = useCallback((filter: Filter) => {
    const { filterType } = filter;

    switch (filterType) {
      case "SELECT":
        return <FilterSelectView filter={filter} onChange={() => {}} />;
      default:
        return null;
    }
  }, []);

  return <View className={cn("p-20 h-full", className)}>{renderContent(filter)}</View>;
}
