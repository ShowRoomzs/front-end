import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { toast } from "@/common/providers/ToastProvider";
import { lightHaptic } from "@/common/utils/haptics";
import { HOME_SUMMARY_QUERY_KEY } from "@/features/home/hooks/useHomeSummary";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { SEARCH_QUERY_KEY } from "@/features/search/constants/queryKey";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";
import { ShowroomDetail } from "@/features/showroom/types/showroom";

/**
 * 차단을 바꾸면 서버가 거르는 목록이 통째로 달라진다 — 피드 · 쇼룸 목록 · 검색 · 팔로잉(차단하면 팔로우가 끊긴다).
 * 그 쇼룸 하나만 고쳐서는 맞출 수 없어 다시 받는다.
 */
function invalidateBlockedLists() {
  [
    POST_QUERY_KEY.FOLLOWING_FEED,
    POST_QUERY_KEY.RECOMMENDED_FEED,
    SHOWROOM_QUERY_KEY.FOLLOWING_SHOWROOMS,
    SHOWROOM_QUERY_KEY.SHOWROOM_LIST,
    SHOWROOM_QUERY_KEY.SHOWROOM_SEARCH,
    SHOWROOM_QUERY_KEY.ACTIVE_SHOWROOMS,
    SHOWROOM_QUERY_KEY.BLOCKED_SHOWROOMS,
    SEARCH_QUERY_KEY.RECENT_SEARCH,
    HOME_SUMMARY_QUERY_KEY,
  ].forEach(key => void queryClient.invalidateQueries({ queryKey: [key] }));
}

/** 쇼룸 프로필 캐시 — [차단 해제] ↔ [팔로우]가 바로 바뀌게. 차단하면 팔로우도 끊긴다 */
function patchShowroomDetail(showroomId: number, isBlocked: boolean) {
  queryClient.setQueryData<ShowroomDetail>([SHOWROOM_QUERY_KEY.SHOWROOM_DETAIL, showroomId], detail => {
    if (!detail) {
      return detail;
    }
    const unfollowed = isBlocked && detail.isFollowing;

    return {
      ...detail,
      isBlocked,
      isFollowing: isBlocked ? false : detail.isFollowing,
      followerCount: unfollowed ? Math.max(0, detail.followerCount - 1) : detail.followerCount,
    };
  });
}

function resolveBlockError(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;

  return status === 400 ? "내 쇼룸은 차단할 수 없어요" : "잠시 후 다시 시도해 주세요";
}

/**
 * 쇼룸 차단 · 해제 (App Store 심사 1.2) — 게시물 ⋯ [이 쇼룸의 게시물 그만 보기](시안 C5) · 쇼룸 프로필
 * [차단 해제] · 설정 > 차단한 쇼룸이 같이 쓴다. 로그인 확인은 부르는 쪽이 한다(usePermissionPress).
 */
export function useShowroomBlock() {
  const { mutate: block } = useMutation({
    mutationFn: (showroomId: number) => showroomService.block(showroomId),
    onSuccess: (_data, showroomId) => {
      patchShowroomDetail(showroomId, true);
      invalidateBlockedLists();
      toast.success("이 쇼룸의 게시물을 더 이상 보여드리지 않아요");
    },
    onError: error => toast.show(resolveBlockError(error)),
  });

  const { mutate: unblock } = useMutation({
    mutationFn: (showroomId: number) => showroomService.unblock(showroomId),
    onSuccess: (_data, showroomId) => {
      patchShowroomDetail(showroomId, false);
      invalidateBlockedLists();
      toast.success("차단을 해제했어요");
    },
    onError: error => toast.show(resolveBlockError(error)),
  });

  const blockShowroom = useCallback(
    (showroomId: number) => {
      lightHaptic();
      block(showroomId);
    },
    [block]
  );

  const unblockShowroom = useCallback(
    (showroomId: number) => {
      lightHaptic();
      unblock(showroomId);
    },
    [unblock]
  );

  return { blockShowroom, unblockShowroom };
}
