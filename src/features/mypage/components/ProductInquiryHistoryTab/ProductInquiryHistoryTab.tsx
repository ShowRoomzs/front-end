import { useCallback } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import ProductInquiryHistoryItem from "@/features/mypage/components/ProductInquiryHistoryItem/ProductInquiryHistoryItem";
import { useGetProductInquiryHistory } from "@/features/product/hooks/useGetProductInquiryHistory";
import { ProductInquiryHistory, ProductInquiryHistoryParams } from "@/features/product/types/productInquiry";

const INITIAL_PARAMS: ProductInquiryHistoryParams = {
  page: 1,
  limit: 10,
};

export default function ProductInquiryHistoryTab() {
  const { params } = useParams<ProductInquiryHistoryParams>(INITIAL_PARAMS);
  const { inquiries, pageInfo, isFetching, fetchNextPage } = useGetProductInquiryHistory(params);
  const mainNavigation = useMainNavigation();

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressEdit = useCallback((id: number) => {
    console.log("id", id);
  }, []);

  const handlePressDelete = useCallback((id: number) => {
    console.log("id", id);
  }, []);

  const handlePressProduct = useCallback(
    (productId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: {
          productId,
        },
      });
    },
    [mainNavigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: ProductInquiryHistory }) => {
      return (
        <ProductInquiryHistoryItem
          item={item}
          onPressEdit={handlePressEdit}
          onPressDelete={handlePressDelete}
          onPressProduct={handlePressProduct}
        />
      );
    },
    [handlePressEdit, handlePressDelete, handlePressProduct]
  );

  return (
    <PagingList<ProductInquiryHistory>
      className="bg-gray0"
      data={inquiries}
      pageInfo={pageInfo}
      ItemSeparatorComponent={() => <View className="h-10" />}
      isLoading={isFetching}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}
