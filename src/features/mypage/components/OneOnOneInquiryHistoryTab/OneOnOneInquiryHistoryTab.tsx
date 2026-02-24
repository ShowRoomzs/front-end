import { useCallback } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { useGetInquiries } from "@/features/inquiry/hooks/useGetInquiries";
import { useDeleteInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useDeleteInquiryMutation";
import { InquiryHistory, InquiryHistoryParams } from "@/features/inquiry/types/inquiry";
import OneOnOneInquiryHistoryItem from "@/features/mypage/components/OneOnOneInquiryHistoryItem/OneOnOneInquiryHistoryItem";

const INITIAL_PARAMS: InquiryHistoryParams = {
  page: 1,
  limit: 10,
};

export default function OneOnOneInquiryHistoryTab() {
  const { params } = useParams<InquiryHistoryParams>(INITIAL_PARAMS);
  const { inquiries, pageInfo, isFetching, fetchNextPage } = useGetInquiries(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressEdit = useCallback((id: number) => {
    console.log("id", id);
  }, []);

  const handlePressDelete = useCallback(
    (id: number) => {
      return deleteInquiry(id);
    },
    [deleteInquiry]
  );

  const renderItem = useCallback(
    ({ item }: { item: InquiryHistory }) => {
      return (
        <OneOnOneInquiryHistoryItem
          item={item}
          onPressEdit={handlePressEdit}
          onPressDelete={handlePressDelete}
        />
      );
    },
    [handlePressEdit, handlePressDelete]
  );

  return (
    <PagingList<InquiryHistory>
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
