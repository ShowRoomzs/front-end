import { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";

import type { WishlistProductType } from "@/features/wishlist/types/wishlist";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import {
  WISHLIST_PRODUCT_LIST_GAP,
  WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS,
  WISHLIST_PRODUCT_LIST_PADDING_HORIZONTAL,
  WISHLIST_PRODUCT_LIST_PADDING_VERTICAL,
} from "@/features/wishlist/components/WishlistProductList/config";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";
import { WishlistParams } from "@/features/wishlist/types/params";

interface WishlistProductListProps {
  categoryId: number | null;
  onLoad?: (products: Array<WishlistProductType>) => void;
}
const INITIAL_PARAMS: WishlistParams = {
  page: 1,
  limit: 10,
  categoryId: null,
};

export default function WishlistProductList(props: WishlistProductListProps) {
  const { categoryId, onLoad } = props;
  const isMounted = useRef(false);
  const { params } = useParams<WishlistParams>({
    ...INITIAL_PARAMS,
    categoryId,
  });

  const { products, pageInfo, isLoading, fetchNextPage } = useGetWishlist(params);

  useEffect(() => {
    if (isMounted.current || !onLoad || isLoading) {
      return;
    }
    onLoad(products);
    isMounted.current = true;
  }, [products, onLoad, isLoading]);

  //   const handlePressProduct = useCallback((product: WishlistProduct) => {
  //     console.log(product);
  //   }, []);

  //   const handlePressLike = useCallback((productId: number, newIsWished: boolean) => {
  //     console.log(productId, newIsWished);
  //   }, []);

  const renderItem = useCallback(({ item }: { item: WishlistProductType }) => {
    void item;
    return <Text>wishlist product dto 변경후 작업</Text>;
  }, []);

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
