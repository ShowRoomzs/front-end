import { View } from "react-native";

import FilterView from "@/features/category/components/FilterView/FilterView";
import { useFilters } from "@/features/category/hooks/useFilters";

interface CategoryDetailContentProps {
  categoryId: number;
}
export default function CategoryDetailContent(props: CategoryDetailContentProps) {
  const { categoryId } = props;
  const { filters } = useFilters(categoryId);

  return (
    <View className="flex-1">
      <FilterView filters={filters} />
    </View>
  );
}
