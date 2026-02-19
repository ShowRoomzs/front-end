import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import PagingList from "@/common/components/PagingList/PagingList";
import { SORT_FILTER_KEY } from "@/common/constants/filterKey";
import { useParams } from "@/common/hooks/useParams";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import {
  MARKET_PRODUCT_LIST_GAP,
  MARKET_PRODUCT_LIST_ITEM_WIDTH,
  MARKET_PRODUCT_LIST_NUM_COLUMNS,
  MARKET_PRODUCT_LIST_PADDING,
} from "@/features/market/components/MarketProductList/config";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { ProductListParams } from "@/features/product/types/params";
import { Product } from "@/features/product/types/product";

export interface MarketProductListRef {
  loadMore: () => void;
  isLoading: boolean;
  hasNext: boolean;
}

interface MarketProductListProps {
  categoryId: number | null;
  marketId: number;
  keyword: string;
  selectedSortValues: Array<string>;
  onContentHeightChange?: (height: number) => void;
}

const INITIAL_PARAMS: ProductListParams = {
  q: "",
  categoryId: null,
  marketId: null,
  filters: [],
  page: 1,
  limit: 10,
};

const MarketProductList = forwardRef<MarketProductListRef, MarketProductListProps>((props, ref) => {
  const { categoryId, marketId, keyword, onContentHeightChange, selectedSortValues } = props;
  const navigation = useMainNavigation();

  const { params, updateParams } = useParams<ProductListParams>({
    ...INITIAL_PARAMS,
    categoryId, // 초기값
    marketId, // 초기값
    filters: selectedSortValues.map(value => ({
      key: SORT_FILTER_KEY,
      values: [value],
    })),
  });
  const { products, pageInfo, isLoading, fetchNextPage } = useGetProducts(params);
  const isLoadingRef = useRef(isLoading);
  const hasNextRef = useRef(pageInfo?.hasNext ?? false);

  useEffect(() => {
    if (!keyword) {
      return;
    }
    updateParams("q", keyword);
  }, [keyword, updateParams]);

  useEffect(() => {
    if (!selectedSortValues.length) {
      return;
    }
    updateParams(
      "filters",
      selectedSortValues.map(value => ({
        key: SORT_FILTER_KEY,
        values: [value],
      }))
    );
  }, [selectedSortValues, updateParams]);

  useEffect(() => {
    if (!keyword) {
      return;
    }
    updateParams("q", keyword);
  }, [keyword, updateParams]);

  isLoadingRef.current = isLoading;
  hasNextRef.current = pageInfo?.hasNext ?? false;

  useImperativeHandle(ref, () => ({
    loadMore: fetchNextPage,
    get isLoading() {
      return isLoadingRef.current;
    },
    get hasNext() {
      return hasNextRef.current;
    },
  }));

  const handlePressProduct = useCallback(
    (product: Product) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: { productId: product.id },
      });
    },
    [navigation]
  );

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handleContentSizeChange = useCallback(
    (_: number, height: number) => {
      onContentHeightChange?.(height);
    },
    [onContentHeightChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      return (
        <ProductCard product={item} onPress={handlePressProduct} width={MARKET_PRODUCT_LIST_ITEM_WIDTH} />
      );
    },
    [handlePressProduct]
  );

  return (
    <PagingList<Product>
      data={products}
      onLoadMore={handleLoadMore}
      pageInfo={pageInfo}
      renderItem={renderItem}
      isLoading={isLoading}
      scrollEnabled={false}
      onContentSizeChange={handleContentSizeChange}
      numColumns={MARKET_PRODUCT_LIST_NUM_COLUMNS}
      contentContainerStyle={{
        paddingHorizontal: MARKET_PRODUCT_LIST_PADDING,
        paddingTop: MARKET_PRODUCT_LIST_PADDING,
      }}
      columnWrapperStyle={{
        gap: MARKET_PRODUCT_LIST_GAP,
        marginBottom: MARKET_PRODUCT_LIST_GAP,
      }}
    />
  );
});

MarketProductList.displayName = "MarketProductList";

export default MarketProductList;
