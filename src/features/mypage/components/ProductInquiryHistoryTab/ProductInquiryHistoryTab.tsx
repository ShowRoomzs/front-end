import { useCallback } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { toast } from "@/common/providers/ToastProvider";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import ProductInquiryHistoryItem from "@/features/mypage/components/ProductInquiryHistoryItem/ProductInquiryHistoryItem";
import { useDeleteInquiryMutation } from "@/features/product/hooks/useDeleteInquiryMutation";
import { useGetProductInquiryHistory } from "@/features/product/hooks/useGetProductInquiryHistory";
import { ProductInquiryHistory, ProductInquiryHistoryParams } from "@/features/product/types/productInquiry";

const INITIAL_PARAMS: ProductInquiryHistoryParams = {
  page: 1,
  limit: 10,
};

export default function ProductInquiryHistoryTab() {
  const { params } = useParams<ProductInquiryHistoryParams>(INITIAL_PARAMS);
  const { inquiries, pageInfo, isFetching, fetchNextPage } = useGetProductInquiryHistory(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();
  const mainNavigation = useMainNavigation();

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressEdit = useCallback(
    (id: number, productId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_INQUIRY,
        params: {
          productId: productId,
          inquiryId: id,
        },
      });
    },
    [mainNavigation]
  );

  const handlePressDelete = useCallback(
    async (id: number) => {
      try {
        await deleteInquiry(id);
        toast.show("문의가 삭제되었습니다.");
      } catch (error) {
        console.error(error);
      }
    },
    [deleteInquiry]
  );

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
