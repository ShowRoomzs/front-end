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
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import InquiryListHeader from "@/features/mypage/components/InquiryListHeader/InquiryListHeader";
import ProductInquiryHistoryItem from "@/features/mypage/components/ProductInquiryHistoryItem/ProductInquiryHistoryItem";
import { useDeleteInquiryMutation } from "@/features/product/hooks/useDeleteInquiryMutation";
import { useGetProductInquiryHistory } from "@/features/product/hooks/useGetProductInquiryHistory";
import { ProductInquiryHistory } from "@/features/product/types/productInquiry";

/**
 * 상품 문의 탭 (C12) — 1:1 탭과 같은 규칙을 쓴다.
 *
 * 다른 점은 답변을 목록 안에서 펼친다는 것 하나뿐이고, 필터·카운트·빈 상태·⋯ 메뉴는
 * 두 탭이 같은 골격을 공유한다.
 */
const PAGE_SIZE = 10;
const MORE_SHEET_ID = "product-inquiry-more";

type MoreAction = "edit" | "delete";

const MORE_ITEMS: Array<{ value: MoreAction; label: string }> = [
  { value: "edit", label: "문의 수정" },
  { value: "delete", label: "문의 삭제" },
];

export default function ProductInquiryHistoryTab() {
  const mainNavigation = useMainNavigation();
  const { show: showModal } = useModal();
  const { close: closeMoreSheet } = useBottomSheetContext();
  const [isWaitingOnly, setIsWaitingOnly] = useState(false);
  const [moreTarget, setMoreTarget] = useState<ProductInquiryHistory | null>(null);

  const params = useMemo(
    () => ({ size: PAGE_SIZE, ...(isWaitingOnly ? { status: "WAITING" as const } : null) }),
    [isWaitingOnly]
  );
  const { content: inquiries, pageInfo, isFetching, fetchNextPage } = useGetProductInquiryHistory(params);
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();

  const handleSelectMoreAction = useCallback(
    async (action: MoreAction) => {
      const target = moreTarget;

      closeMoreSheet();
      if (!target) {
        return;
      }

      if (action === "edit") {
        mainNavigation.navigate(ROOT_ROUTES.COMMON, {
          screen: COMMON_ROUTES.PRODUCT_INQUIRY,
          params: { productId: target.productId, inquiryId: target.id },
        });
        return;
      }

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
    [closeMoreSheet, deleteInquiry, mainNavigation, moreTarget, showModal]
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
    (item: ProductInquiryHistory) => {
      setMoreTarget(item);
      openMoreSheet();
    },
    [openMoreSheet]
  );

  const renderItem = useCallback(
    ({ item }: { item: ProductInquiryHistory }) => (
      <ProductInquiryHistoryItem item={item} onPressMore={handlePressMore} />
    ),
    [handlePressMore]
  );

  const total = pageInfo?.totalElements ?? inquiries.length;

  return (
    <PagingList<ProductInquiryHistory>
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
            title={isWaitingOnly ? "답변 대기 중인 문의가 없어요" : "상품 문의 내역이 없어요"}
            description={
              isWaitingOnly ? "모든 문의에 답변이 등록되었어요" : "상품 상세에서 궁금한 점을 물어보세요"
            }
          />
        )
      }
    />
  );
}
