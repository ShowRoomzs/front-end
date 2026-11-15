import { useCallback, useState } from "react";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import PostMoreSheetContent from "@/features/post/components/PostMoreSheetContent/PostMoreSheetContent";
import { useUpdatePostLike } from "@/features/post/hooks/useUpdatePostLike";
import { useShowroomBlock } from "@/features/showroom/hooks/useShowroomBlock";
import { useUpdateShowroomFollow } from "@/features/showroom/hooks/useUpdateShowroomFollow";

const MORE_SHEET_ID = "postMoreSheet";

/**
 * 피드 카드가 필요로 하는 동작을 한 곳에 모은다 — C1 홈 · C3 좋아요 · C4 쇼룸이 같은 카드를 쓰고,
 * 좋아요·팔로우·신고·이동이 세 화면에서 똑같이 동작해야 한다.
 *
 * ⋯는 먼저 메뉴(신고 · 그만 보기(차단) · 링크 복사)를 띄우고, 신고를 고르면 같은 시트 안에서 사유 목록으로 넘어간다.
 *
 * 좋아요·팔로우는 로그인이 필요하지만 버튼을 비활성으로 두지 않는다. 탭하면 로그인으로 보내고
 * 원래 액션을 이어서 실행한다 — 잠긴 것처럼 보이는 버튼은 탭을 시도하지 않게 만든다.
 */
export function useFeedActions() {
  const navigation = useMainNavigation();
  const { close: closeSheet } = useBottomSheetContext();
  const { toggle: toggleLike } = useUpdatePostLike();
  const { toggle: toggleFollow } = useUpdateShowroomFollow();
  const { blockShowroom } = useShowroomBlock();
  const [moreTarget, setMoreTarget] = useState<{ postId: number; showroomId: number } | null>(null);

  const handleCloseMore = useCallback(() => {
    setMoreTarget(null);
    closeSheet();
  }, [closeSheet]);

  // 차단은 로그인이 필요하다 — 비로그인이면 로그인 뒤 이어서 차단한다
  const handleBlock = usePermissionPress((showroomId: number) => {
    blockShowroom(showroomId);
  });

  const { open: openMoreSheet } = useBottomSheet({
    id: MORE_SHEET_ID,
    render: moreTarget ? (
      <PostMoreSheetContent
        postId={moreTarget.postId}
        onClose={handleCloseMore}
        onPressBlock={() => void handleBlock(moreTarget.showroomId)}
      />
    ) : (
      <></>
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const handlePressPost = useCallback(
    (postId: number) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.POST_DETAIL,
        params: { postId },
      });
    },
    [navigation]
  );

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [navigation]
  );

  /** 공구 게시물의 상품 행 — 게시물이 아니라 상품 상세로 간다 */
  const handlePressProduct = useCallback(
    (productId: number, groupBuyId?: number | null) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: { productId, groupBuyId: groupBuyId ?? undefined },
      });
    },
    [navigation]
  );

  const handlePressLike = usePermissionPress((postId: number, isLiked: boolean) => {
    toggleLike(postId, isLiked);
  });

  const handlePressFollow = usePermissionPress((showroomId: number, isFollowing: boolean) => {
    toggleFollow(showroomId, isFollowing);
  });

  const handlePressMore = useCallback(
    (postId: number, showroomId: number) => {
      setMoreTarget({ postId, showroomId });
      openMoreSheet();
    },
    [openMoreSheet]
  );

  return {
    handlePressPost,
    handlePressShowroom,
    handlePressProduct,
    handlePressLike,
    handlePressFollow,
    handlePressMore,
  };
}
