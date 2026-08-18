import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { PageResponse } from "@/common/types/page";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { FeedItem } from "@/features/post/types/post";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";
import { ShowroomDetail } from "@/features/showroom/types/showroom";

type FeedCache = InfiniteData<PageResponse<FeedItem>, number> | undefined;

const FEED_QUERY_KEYS = [
  POST_QUERY_KEY.FOLLOWING_FEED,
  POST_QUERY_KEY.RECOMMENDED_FEED,
  POST_QUERY_KEY.LIKED_POSTS,
  POST_QUERY_KEY.SHOWROOM_POSTS,
];

/**
 * 피드에 떠 있는 같은 쇼룸의 카드들을 한 번에 고친다 — 추천 피드에는 한 쇼룸의 게시물이
 * 여러 장 실릴 수 있고, 하나만 눌렀는데 나머지에 팔로우 버튼이 남아 있으면 눌린 것처럼 보이지 않는다.
 */
function patchFollowState(showroomId: number, isFollowing: boolean) {
  FEED_QUERY_KEYS.forEach(key => {
    queryClient.setQueriesData<FeedCache>({ queryKey: [key] }, cache => {
      if (!cache) {
        return cache;
      }

      return {
        ...cache,
        pages: cache.pages.map(page => ({
          ...page,
          content: page.content.map(item =>
            item.post.showroomId === showroomId ? { ...item, post: { ...item.post, isFollowing } } : item
          ),
        })),
      };
    });
  });

  queryClient.setQueryData<ShowroomDetail>([SHOWROOM_QUERY_KEY.SHOWROOM_DETAIL, showroomId], detail =>
    detail
      ? {
          ...detail,
          isFollowing,
          followerCount: Math.max(0, detail.followerCount + (isFollowing ? 1 : -1)),
        }
      : detail
  );
}

/**
 * @param keepFollowingList C2 팔로잉 목록에서는 [팔로잉]을 눌러도 행을 지우지 않는다 — 즉시
 * 언팔로우되고 버튼만 [팔로우]로 바뀌어 재팔로우할 수 있다. 목록을 바로 다시 받아오면 방금 누른
 * 행이 사라져 되돌릴 자리가 없어진다. 정리는 화면을 떠날 때 이뤄진다.
 */
export function useUpdateShowroomFollow(keepFollowingList = false) {
  const mutation = useMutation({
    mutationFn: ({ showroomId, isFollowing }: { showroomId: number; isFollowing: boolean }) =>
      isFollowing ? showroomService.follow(showroomId) : showroomService.unfollow(showroomId),
    onMutate: ({ showroomId, isFollowing }) => {
      patchFollowState(showroomId, isFollowing);
    },
    onError: (_error, { showroomId, isFollowing }) => {
      patchFollowState(showroomId, !isFollowing);
    },
    onSuccess: () => {
      // 팔로잉 목록과 팔로잉 피드는 구성이 통째로 달라지므로 다시 받는다
      if (!keepFollowingList) {
        void queryClient.invalidateQueries({ queryKey: [SHOWROOM_QUERY_KEY.FOLLOWING_SHOWROOMS] });
      }
      void queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY.FOLLOWING_FEED] });
    },
  });

  const { mutate } = mutation;

  const toggle = useCallback(
    (showroomId: number, currentIsFollowing: boolean) => {
      mutate({ showroomId, isFollowing: !currentIsFollowing });
    },
    [mutate]
  );

  return { ...mutation, toggle };
}
