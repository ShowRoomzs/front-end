import { useCallback, useEffect, useRef, useState } from "react";
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
  const { params, updateLocalParams, localParams, updateParams } = useProductParams(INITIAL_PARAMS);
  const isMounted = useRef(false);
  const { data: products } = useGetProducts(params);

  console.log(products);

  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const { bottom } = useSafeAreaInsets();

  // 기본 필터 초기화
  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    const defaultSelectedFilters: Array<FilterParam> = filters.reduce((acc, filter) => {
      const defaultFilters = filter.values.filter(v => v.extra === "default");

      if (defaultFilters.length > 0) {
        acc.push({
          key: filter.filterKey,
          values: [...defaultFilters.map(v => v.value)],
        });
        return acc;
      }
      return acc;
    }, [] as Array<FilterParam>);

    isMounted.current = true;
    updateParams("filters", defaultSelectedFilters);
  }, [filters, updateParams]);

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
