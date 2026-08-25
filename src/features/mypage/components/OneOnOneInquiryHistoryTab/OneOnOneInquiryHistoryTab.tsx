import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

import { SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import PagingList from "@/common/components/PagingList/PagingList";
import SheetList from "@/common/components/SheetList/SheetList";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useModal } from "@/common/providers/ModalProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { useGetInquiryHistory } from "@/features/inquiry/hooks/useGetInquiryHistory";
import { useDeleteInquiryMutation } from "@/features/inquiry/hooks/useInquiryMutation/useDeleteInquiryMutation";
import { InquiryHistory } from "@/features/inquiry/types/inquiry";
import InquiryListHeader from "@/features/mypage/components/InquiryListHeader/InquiryListHeader";
import OneOnOneInquiryHistoryItem from "@/features/mypage/components/OneOnOneInquiryHistoryItem/OneOnOneInquiryHistoryItem";

/**
 * 1:1 문의 탭 (C12).
 *
 * [답변 대기만]은 **서버에 status를 넘겨** 거른다. 받아 둔 페이지에서만 거르면 다음 페이지에
 * 있는 대기 건이 보이지 않아, 필터를 켠 사람이 정작 찾던 것을 놓친다.
 */
const PAGE_SIZE = 10;
const MORE_SHEET_ID = "one-on-one-inquiry-more";

type MoreAction = "edit" | "delete";

const MORE_ITEMS: Array<{ value: MoreAction; label: string }> = [
  { value: "edit", label: "문의 수정" },
  { value: "delete", label: "문의 삭제" },
];

export default function OneOnOneInquiryHistoryTab() {
  const navigation = useMypageNavigation();
  const { show: showModal } = useModal();
  // 시트 등록보다 먼저 닫기가 필요하므로 컨텍스트에서 직접 받는다
  const { close: closeMoreSheet } = useBottomSheetContext();
  const [isWaitingOnly, setIsWaitingOnly] = useState(false);
  const [moreTarget, setMoreTarget] = useState<InquiryHistory | null>(null);

  const params = useMemo(
    () => ({ size: PAGE_SIZE, ...(isWaitingOnly ? { status: "WAITING" as const } : null) }),
    [isWaitingOnly]
  );
  const { content: inquiries, pageInfo, isFetching, fetchNextPage } = useGetInquiryHistory(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();

  const handlePressItem = useCallback(
    (inquiryId: number) => {
      navigation.navigate(MYPAGE_ROUTES.INQUIRY_DETAIL, { inquiryId });
    },
    [navigation]
  );

  const handleSelectMoreAction = useCallback(
    async (action: MoreAction) => {
      const target = moreTarget;

      closeMoreSheet();
      if (!target) {
        return;
      }

      if (action === "edit") {
        navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER, { inquiryId: target.id });
        return;
      }

      // 데이터 항목을 지우는 모달 — 모달을 연 목적(삭제)이 로즈·우측이다
      showModal({
        title: "문의를 삭제할까요?",
        message: "삭제하면 되돌릴 수 없어요",
        buttons: [
          { label: "취소", variant: "outline" },
          {
            label: "삭제하기",
            onPress: async () => {
              try {
                await deleteInquiry(target.id);
                toast.show("문의가 삭제되었습니다");
              } catch {
                toast.show("문의를 삭제하지 못했어요");
              }
            },
          },
        ],
      });
    },
    [closeMoreSheet, deleteInquiry, moreTarget, navigation, showModal]
  );

  const { open: openMoreSheet } = useBottomSheet({
    id: MORE_SHEET_ID,
    /* 다음 단계로 넘어가는 목록이 아니라 **행동을 고르는** 시트라 우측 셰브런을 두지 않는다 */
    render: (
      <SheetList title="문의 관리" items={MORE_ITEMS} mode="select" onSelect={handleSelectMoreAction} />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const handlePressMore = useCallback(
    (item: InquiryHistory) => {
      setMoreTarget(item);
      openMoreSheet();
    },
    [openMoreSheet]
  );

  const renderItem = useCallback(
    ({ item }: { item: InquiryHistory }) => (
      <OneOnOneInquiryHistoryItem item={item} onPress={handlePressItem} onPressMore={handlePressMore} />
    ),
    [handlePressItem, handlePressMore]
  );

  const total = pageInfo?.totalElements ?? inquiries.length;

  return (
    <PagingList<InquiryHistory>
      data={inquiries}
      pageInfo={pageInfo}
      ItemSeparatorComponent={() => <View className="h-0.5 bg-dividerProduct" />}
      isLoading={isFetching}
      onLoadMore={fetchNextPage}
      renderItem={renderItem}
      ListHeaderComponent={
        <InquiryListHeader
          countLabel={`${isWaitingOnly ? "답변 대기" : "전체"} ${total}건`}
          isWaitingOnly={isWaitingOnly}
          onToggleWaitingOnly={() => setIsWaitingOnly(prev => !prev)}
        />
      }
      ListEmptyComponent={
        isFetching ? undefined : (
          <EmptyState
            icon={<SpeechBubbleIcon size={50} color="#D8D8DA" />}
            title={isWaitingOnly ? "답변 대기 중인 문의가 없어요" : "1:1 문의 내역이 없어요"}
            description={
              isWaitingOnly ? "모든 문의에 답변이 등록되었어요" : "주문·배송·환불은 1:1 문의로 접수해 주세요"
            }
          />
        )
      }
    />
  );
}
