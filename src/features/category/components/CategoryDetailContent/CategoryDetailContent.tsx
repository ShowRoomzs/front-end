import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useParams } from "@/common/hooks/useParams";
import FilterBottomSheetView, {
  FILTER_BOTTOM_SHEET_HEIGHT,
} from "@/features/category/components/FilterBottomSheetView/FilterBottomSheetView";
import FilterListView from "@/features/category/components/FilterListView/FilterListView";
import { useFilters } from "@/features/category/hooks/useFilters";
import ProductListView from "@/features/product/components/ProductListView/ProductListView";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { FilterParam, ProductListParams } from "@/features/product/types/params";
import { Product } from "@/features/product/types/product";

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
  const { params, updateParams } = useParams<ProductListParams>({
    ...INITIAL_PARAMS,
    categoryId,
  });
  const { data: productList, isLoading } = useGetProducts(params);
  const isMounted = useRef(false);
  const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
  const [localProducts, setLocalProducts] = useState<Array<Product>>([]);
  const prevPageRef = useRef<number>(1);
  const { bottom } = useSafeAreaInsets();

  // 페이지 누적 처리
  useEffect(() => {
    if (!productList?.products?.length || !productList?.pageInfo) {
      return;
    }

    const { currentPage } = productList.pageInfo;
    const isInitialLoad = currentPage === 1;
    const isNewPage = currentPage !== prevPageRef.current;

    if (isInitialLoad) {
      setLocalProducts(productList.products);
    } else if (isNewPage) {
      setLocalProducts(prev => [...prev, ...productList.products]);
    }

    prevPageRef.current = currentPage;
  }, [productList?.products, productList?.pageInfo]);

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

  const handlePressReset = useCallback(() => {
    console.log("reset");
  }, []);

  const handlePressApply = useCallback(
    (newFilters: Array<FilterParam>) => {
      updateParams("filters", newFilters);
      updateParams("page", 1);
      prevPageRef.current = 1;
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
        previewParams={{ ...params, page: 1 }}
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

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams("page", page);
    },
    [updateParams]
  );

  // 서버 데이터는 있는데 localProducts가 아직 세팅 안된 경우를 처리
  const isActuallyLoading = isLoading || (!!productList?.products?.length && localProducts.length === 0);

  return (
    <View className="flex-1">
      <FilterListView filters={filters} onPressFilter={handlePressFilter} />
      <ProductListView
        data={localProducts}
        pageInfo={productList?.pageInfo}
        isLoading={isActuallyLoading}
        onPageChange={handlePageChange}
      />
    </View>
  );
}
