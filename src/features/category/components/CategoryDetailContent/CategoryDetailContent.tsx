import { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import FilterBottomSheetView, {
  FILTER_BOTTOM_SHEET_HEIGHT,
} from "@/features/category/components/FilterBottomSheetView/FilterBottomSheetView";
import FilterListView from "@/features/category/components/FilterListView/FilterListView";
import { useFilters } from "@/features/category/hooks/useFilters";

interface CategoryDetailContentProps {
  categoryId: number;
}

export default function CategoryDetailContent(props: CategoryDetailContentProps) {
  const { categoryId } = props;
  const { filters } = useFilters(categoryId);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const { bottom } = useSafeAreaInsets();
  const { open } = useBottomSheet({
    id: "filter-bottom-sheet",
    render: <FilterBottomSheetView filters={filters} selectedId={selectedFilterId} />,
    sheetProps: {
      snapPoints: [FILTER_BOTTOM_SHEET_HEIGHT + bottom],
    },
  });

  const handlePressFilter = useCallback(
    (filterId: number) => {
      setSelectedFilterId(filterId);
      open();
    },
    [open]
  );

  return (
    <View className="flex-1">
      <FilterListView filters={filters} onPressFilter={handlePressFilter} />
    </View>
  );
}
