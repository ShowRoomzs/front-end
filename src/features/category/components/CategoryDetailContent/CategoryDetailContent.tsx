import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import FilterBottomSheetView, {
  FILTER_BOTTOM_SHEET_HEIGHT,
} from "@/features/category/components/FilterBottomSheetView/FilterBottomSheetView";
import FilterListView from "@/features/category/components/FilterListView/FilterListView";
import { useFilters } from "@/features/category/hooks/useFilters";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { useProductParams } from "@/features/product/hooks/useProductParams";
import { FilterParam, ProductListParams } from "@/features/product/types/params";

interface CategoryDetailContentProps {
  categoryId: number;
}

const INITIAL_PARAMS: ProductListParams = {
  page: 1,
  limit: 10,
  q: "",
  categoryId: null,
  marketId: null,
  filters: [],
};

export default function CategoryDetailContent(props: CategoryDetailContentProps) {
  const { categoryId } = props;
  const { filters } = useFilters(categoryId);
  const { params, updateLocalParams, localParams } = useProductParams(INITIAL_PARAMS);
  const { data: products } = useGetProducts(params);

  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const { bottom } = useSafeAreaInsets();

  const handleChangeFilters = useCallback(
    (newFilters: Array<FilterParam>) => {
      const updatedFilters = [...localParams.filters];

      newFilters.forEach(newFilter => {
        const existingIndex = updatedFilters.findIndex(f => f.key === newFilter.key);

        if (existingIndex !== -1) {
          updatedFilters[existingIndex] = newFilter;
        } else {
          updatedFilters.push(newFilter);
        }
      });

      updateLocalParams("filters", updatedFilters);
    },
    [localParams.filters, updateLocalParams]
  );
  const { open } = useBottomSheet({
    id: "filter-bottom-sheet",
    render: (
      <FilterBottomSheetView
        selectedFilters={localParams.filters}
        filters={filters}
        selectedId={selectedFilterId}
        onChange={handleChangeFilters}
      />
    ),
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
      {/* 상품 리스트 */}
      <Text>asdf</Text>
    </View>
  );
}
