import { useCallback, useEffect } from "react";
import { View } from "react-native";

import type { WishlistProductType } from "@/features/wishlist/types/wishlist";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CleanupFn } from "@/common/types/cleanup";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import {
  WISHLIST_PRODUCT_LIST_GAP,
  WISHLIST_PRODUCT_LIST_ITEM_WIDTH,
  WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS,
  WISHLIST_PRODUCT_LIST_PADDING_HORIZONTAL,
  WISHLIST_PRODUCT_LIST_PADDING_VERTICAL,
} from "@/features/wishlist/components/WishlistProductList/config";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";
import { useUpdateWishlist } from "@/features/wishlist/hooks/useUpdateWishlist";
import { WishlistParams } from "@/features/wishlist/types/params";

interface WishlistProductListProps {
  categoryId: number | null;
  // 좋아요 업데이트 시 외부로 cleanup 함수 전달(view단에서 뒷정리 처리하기 위함)
  onUpdateCallback?: (cleanupFns: Array<CleanupFn>) => void;
}
const INITIAL_PARAMS: WishlistParams = {
  size: 10,
  categoryId: null,
};

export default function WishlistProductList(props: WishlistProductListProps) {
  const { categoryId, onUpdateCallback } = props;
  const { update: updateWishlist, cleanupFns } = useUpdateWishlist();
  const navigation = useMainNavigation();
  const { params } = useParams<WishlistParams>({
    ...INITIAL_PARAMS,
    categoryId,
  });

  const { content: products, pageInfo, isLoading, fetchNextPage } = useGetWishlist(params);

  useEffect(() => {
    if (!cleanupFns?.length || !onUpdateCallback) {
      return;
    }
    onUpdateCallback(cleanupFns);
  }, [cleanupFns, onUpdateCallback]);

  const handlePressProduct = useCallback(
    (product: WishlistProductType) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: {
          productId: product.id,
        },
      });
    },
    [navigation]
  );

  const handlePressLike = useCallback(
    (productId: number, newIsWished: boolean) => {
      updateWishlist(productId, newIsWished);
    },
    [updateWishlist]
  );

  const renderItem = useCallback(
    ({ item }: { item: WishlistProductType }) => {
      return (
        <ProductCard
          product={item}
          onPressLike={handlePressLike}
          onPress={handlePressProduct}
          width={WISHLIST_PRODUCT_LIST_ITEM_WIDTH}
          useOptimisticUpdate={true}
        />
      );
    },
    [handlePressLike, handlePressProduct]
  );

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <View className="flex-1">
      <PagingList<WishlistProductType>
        data={products}
        onLoadMore={handleLoadMore}
        pageInfo={pageInfo}
        renderItem={renderItem}
        isLoading={isLoading}
        numColumns={WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS}
        contentContainerStyle={{
          marginTop: 5,
          paddingHorizontal: WISHLIST_PRODUCT_LIST_PADDING_HORIZONTAL,
        }}
        columnWrapperStyle={{
          gap: WISHLIST_PRODUCT_LIST_GAP,
          paddingVertical: WISHLIST_PRODUCT_LIST_PADDING_VERTICAL,
        }}
      />
    </View>
  );
}
