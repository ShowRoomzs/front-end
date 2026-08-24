import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useParams } from "@/common/hooks/useParams";
import { toast } from "@/common/providers/ToastProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { useGetInquiryHistory } from "@/features/inquiry/hooks/useGetInquiryHistory";
import { useDeleteInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useDeleteInquiryMutation";
import { InquiryHistory, InquiryHistoryParams } from "@/features/inquiry/types/inquiry";
import InquiryListHeader from "@/features/mypage/components/InquiryListHeader/InquiryListHeader";
import OneOnOneInquiryHistoryItem from "@/features/mypage/components/OneOnOneInquiryHistoryItem/OneOnOneInquiryHistoryItem";

const INITIAL_PARAMS: InquiryHistoryParams = {
  size: 10,
};

export default function OneOnOneInquiryHistoryTab() {
  const { params } = useParams<InquiryHistoryParams>(INITIAL_PARAMS);
  const { content: inquiries, pageInfo, isFetching, fetchNextPage } = useGetInquiryHistory(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();
  const navigation = useMypageNavigation();
  const [isWaitingOnly, setIsWaitingOnly] = useState(false);

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

  /**
   * 필터는 받아 둔 목록에서 거른다 — 서버에 상태 파라미터가 없고, 문의는 한 사람이
   * 수십 건을 넘기지 않아 클라이언트에서 걸러도 충분하다.
   */
  const visibleInquiries = useMemo(
    () => (isWaitingOnly ? inquiries.filter(item => item.status === "WAITING") : inquiries),
    [inquiries, isWaitingOnly]
  );

  return (
    <PagingList<InquiryHistory>
      data={visibleInquiries}
      pageInfo={pageInfo}
      ItemSeparatorComponent={() => <View className="h-0.5 bg-dividerProduct" />}
      isLoading={isFetching}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
      ListHeaderComponent={
        <InquiryListHeader
          countLabel={`1:1 문의 ${pageInfo?.totalElements ?? inquiries.length}`}
          isWaitingOnly={isWaitingOnly}
          onToggleWaitingOnly={() => setIsWaitingOnly(prev => !prev)}
        />
      }
    />
  );
}
