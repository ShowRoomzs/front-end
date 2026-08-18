import { useCallback, useState } from "react";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import ReportSheetContent from "@/features/post/components/ReportSheetContent/ReportSheetContent";
import { useUpdatePostLike } from "@/features/post/hooks/useUpdatePostLike";
import { useUpdateShowroomFollow } from "@/features/showroom/hooks/useUpdateShowroomFollow";

const REPORT_SHEET_ID = "postReportSheet";

/**
 * 피드 카드가 필요로 하는 동작을 한 곳에 모은다 — C1 홈 · C3 좋아요 · C4 쇼룸이 같은 카드를 쓰고,
 * 좋아요·팔로우·신고·이동이 세 화면에서 똑같이 동작해야 한다.
 *
 * 좋아요·팔로우는 로그인이 필요하지만 버튼을 비활성으로 두지 않는다. 탭하면 로그인으로 보내고
 * 원래 액션을 이어서 실행한다 — 잠긴 것처럼 보이는 버튼은 탭을 시도하지 않게 만든다.
 */
export function useFeedActions() {
  const navigation = useMainNavigation();
  const { close: closeSheet } = useBottomSheetContext();
  const { toggle: toggleLike } = useUpdatePostLike();
  const { toggle: toggleFollow } = useUpdateShowroomFollow();
  const [reportPostId, setReportPostId] = useState<number | null>(null);

  const handleCloseReport = useCallback(() => {
    setReportPostId(null);
    closeSheet();
  }, [closeSheet]);

  const { open: openReportSheet } = useBottomSheet({
    id: REPORT_SHEET_ID,
    render: reportPostId ? <ReportSheetContent postId={reportPostId} onClose={handleCloseReport} /> : <></>,
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

  const handlePressLike = usePermissionPress((postId: number, isLiked: boolean) => {
    toggleLike(postId, isLiked);
  });

  const handlePressFollow = usePermissionPress((showroomId: number, isFollowing: boolean) => {
    toggleFollow(showroomId, isFollowing);
  });

  const handlePressMore = useCallback(
    (postId: number) => {
      setReportPostId(postId);
      openReportSheet();
    },
    [openReportSheet]
  );

  return {
    handlePressPost,
    handlePressShowroom,
    handlePressLike,
    handlePressFollow,
    handlePressMore,
  };
}
