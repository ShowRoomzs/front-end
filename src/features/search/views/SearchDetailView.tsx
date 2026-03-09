import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useParams } from "@/common/hooks/useParams";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import FilterBottomSheetView, {
  FILTER_BOTTOM_SHEET_HEIGHT,
} from "@/features/filter/components/FilterBottomSheetView/FilterBottomSheetView";
import FilterListView from "@/features/filter/components/FilterListView/FilterListView";
import { useGetFilters } from "@/features/filter/hooks/useGetFilters";
import { FilterValue } from "@/features/filter/types/filter";
import ProductListView from "@/features/product/components/ProductListView/ProductListView";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { FilterParam, ProductListParams } from "@/features/product/types/params";
import SearchHeader from "@/features/search/components/SearchHeader/SearchHeader";

const INITIAL_PARAMS: ProductListParams = {
  limit: 10,
  categoryId: null,
  marketId: null,
  filters: [],
  q: "",
};

export default function SearchDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SEARCH_DETAIL>>();
  const { bottom } = useSafeAreaInsets();
  const { keyword } = route.params;
  const { params, updateParams } = useParams<ProductListParams>({
    ...INITIAL_PARAMS,
    q: keyword,
  });
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { data: filters } = useGetFilters();
  const {
    content: products,
    pageInfo,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetProducts(params);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current || !filters?.length) {
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

  const filterList = useMemo(() => filters || [], [filters]);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback(
    (newKeyword: string) => {
      updateParams("q", newKeyword);
    },
    [updateParams]
  );

  const handlePressReset = useCallback(() => {
    updateParams("filters", []);
  }, [updateParams]);

  const handlePressApply = useCallback(
    (newFilters: Array<FilterParam>) => {
      updateParams("filters", newFilters);
    },
    [updateParams]
  );

  const renderBottomSheet = useMemo(
    () => (
      <FilterBottomSheetView
        onPressReset={handlePressReset}
        onPressApply={handlePressApply}
        appliedFilters={params.filters}
        filters={filterList}
        selectedId={selectedFilterId}
        previewParams={params}
      />
    ),
    [handlePressReset, handlePressApply, params, filterList, selectedFilterId]
  );

  const { open } = useBottomSheet({
    id: `filter-bottom-sheet-search-detail`,
    render: renderBottomSheet,
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

  const handlePressSearch = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
      params: {
        keyword: keyword,
      },
    });
  }, [keyword, mainNavigation]);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const isActuallyLoading = isLoading || isFetchingNextPage;

  const selectedFilterKeys = useMemo(() => params.filters.map(f => f.key), [params.filters]);

  return (
    <View className="flex-1">
      <SearchHeader
        readOnly
        keyword={keyword}
        onPressBack={handlePressBack}
        wrapperClassName="px-20"
        onSearch={handleSearch}
        onPressSearch={handlePressSearch}
      />
      <FilterListView
        selectedFilterKeys={selectedFilterKeys}
        filters={filterList}
        onPressFilter={handlePressFilter}
        wrapperClassName="border-b-[1px] border-gray2"
      />
      <ProductListView
        data={products}
        pageInfo={pageInfo}
        isLoading={isActuallyLoading}
        onLoadMore={handleLoadMore}
        productCardSize="sm"
        numColumns={3}
      />
    </View>
  );
}
