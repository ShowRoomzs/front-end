import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useParams } from "@/common/hooks/useParams";
import FilterBottomSheetView, {
  FILTER_BOTTOM_SHEET_HEIGHT,
} from "@/features/filter/components/FilterBottomSheetView/FilterBottomSheetView";
import FilterListView from "@/features/filter/components/FilterListView/FilterListView";
import { useFilters } from "@/features/filter/hooks/useFilters";
import { FilterValue } from "@/features/filter/types/filter";
import ProductListView from "@/features/product/components/ProductListView/ProductListView";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { FilterParam, ProductListParams } from "@/features/product/types/params";

interface CategoryDetailContentProps {
  categoryId: number;
}

const INITIAL_PARAMS: ProductListParams = {
  limit: 10,
  q: "",
  categoryId: null,
  marketId: null,
  filters: [],
};

export default function CategoryDetailContent(props: CategoryDetailContentProps) {
  const { categoryId } = props;
  const { filters } = useFilters(categoryId);
  const { params, updateParams } = useParams<ProductListParams>({
    ...INITIAL_PARAMS,
    categoryId,
  });
  const {
    content: products,
    pageInfo,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetProducts(params);
  const isMounted = useRef(false);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const { bottom } = useSafeAreaInsets();

  // 기본 필터 초기화
  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    const defaultSelectedFilters: Array<FilterParam> = filters.reduce((acc, filter) => {
      const defaultFilters = filter.values.filter((v: FilterValue) => v.extra === "default");

      if (defaultFilters.length > 0) {
        acc.push({
          key: filter.filterKey,
          values: [...defaultFilters.map((v: FilterValue) => v.value)],
        });
        return acc;
      }
      return acc;
    }, [] as Array<FilterParam>);

    isMounted.current = true;
    updateParams("filters", defaultSelectedFilters);
  }, [filters, updateParams]);

  const handlePressReset = useCallback(() => {
    console.log("reset");
  }, []);

  const handlePressApply = useCallback(
    (newFilters: Array<FilterParam>) => {
      updateParams("filters", newFilters);
    },
    [updateParams]
  );

  const { open } = useBottomSheet({
    id: `filter-bottom-sheet-${categoryId}`,
    render: (
      <FilterBottomSheetView
        onPressReset={handlePressReset}
        onPressApply={handlePressApply}
        appliedFilters={params.filters}
        filters={filters}
        selectedId={selectedFilterId}
        previewParams={params}
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

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const isActuallyLoading = isLoading || isFetchingNextPage;
  const selectedFilterKeys = useMemo(() => params.filters.map(f => f.key), [params.filters]);

  return (
    <View className="flex-1">
      <FilterListView
        selectedFilterKeys={selectedFilterKeys}
        filters={filters}
        onPressFilter={handlePressFilter}
        wrapperClassName="bg-gray0"
      />
      <ProductListView
        data={products}
        pageInfo={pageInfo}
        isLoading={isActuallyLoading}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
}
