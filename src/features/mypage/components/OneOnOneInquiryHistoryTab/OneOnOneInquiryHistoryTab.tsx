import { useCallback } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { toast } from "@/common/providers/ToastProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { useGetInquiryHistory } from "@/features/inquiry/hooks/useGetInquiryHistory";
import { useDeleteInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useDeleteInquiryMutation";
import { InquiryHistory, InquiryHistoryParams } from "@/features/inquiry/types/inquiry";
import OneOnOneInquiryHistoryItem from "@/features/mypage/components/OneOnOneInquiryHistoryItem/OneOnOneInquiryHistoryItem";

const INITIAL_PARAMS: InquiryHistoryParams = {
  page: 1,
  limit: 10,
};

export default function OneOnOneInquiryHistoryTab() {
  const { params } = useParams<InquiryHistoryParams>(INITIAL_PARAMS);
  const { inquiries, pageInfo, isFetching, fetchNextPage } = useGetInquiryHistory(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();
  const navigation = useMypageNavigation();

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressEdit = useCallback(
    (id: number) => {
      navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER, {
        inquiryId: id,
      });
    },
    [navigation]
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
