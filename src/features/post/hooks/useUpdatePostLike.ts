import { InfiniteData, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { queryClient } from "@/common/lib/queryClient";
import { PageResponse } from "@/common/types/page";
import { POST_QUERY_KEY } from "@/features/post/constants/queryKey";
import { postService } from "@/features/post/services/postService";
import { FeedItem, PostDetail } from "@/features/post/types/post";

type FeedCache = InfiniteData<PageResponse<FeedItem>, number> | undefined;

/** 같은 게시물이 여러 피드(팔로잉·추천·좋아요·쇼룸)에 동시에 떠 있을 수 있다 */
const FEED_QUERY_KEYS = [
  POST_QUERY_KEY.FOLLOWING_FEED,
  POST_QUERY_KEY.RECOMMENDED_FEED,
  POST_QUERY_KEY.LIKED_POSTS,
  POST_QUERY_KEY.SHOWROOM_POSTS,
];

function patchFeedCaches(postId: number, isLiked: boolean) {
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
            item.post.postId === postId
              ? {
                  ...item,
                  post: {
                    ...item.post,
                    isLiked,
                    likeCount: Math.max(0, item.post.likeCount + (isLiked ? 1 : -1)),
                  },
                }
              : item
          ),
        })),
      };
    });
  });

  queryClient.setQueryData<PostDetail>([POST_QUERY_KEY.POST_DETAIL, postId], detail =>
    detail ? { ...detail, isLiked, likeCount: Math.max(0, detail.likeCount + (isLiked ? 1 : -1)) } : detail
  );
}

/**
 * 게시물 좋아요.
 *
 * 하트는 누르는 즉시 채워져야 하므로 캐시를 먼저 고치고 요청을 보낸다(낙관적 갱신).
 * 실패하면 되돌린다 — 서버가 거절하는 대표적인 경우가 마감된 공구에 새 좋아요를 거는 것이고,
 * 그때 하트만 채워진 채로 남으면 다음 진입에서 조용히 사라져 더 헷갈린다.
 *
 * 좋아요 목록(C3)은 낙관적으로 행을 지우지 않는다 — 마감된 공구도 목록에는 남고,
 * 해제한 항목이 바로 사라지면 잘못 눌렀을 때 되돌릴 자리가 없어진다. 화면을 떠났다 오면 갱신된다.
 */
export function useUpdatePostLike() {
  const mutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: number; isLiked: boolean }) =>
      isLiked ? postService.like(postId) : postService.unlike(postId),
    onMutate: ({ postId, isLiked }) => {
      patchFeedCaches(postId, isLiked);
    },
    onError: (_error, { postId, isLiked }) => {
      patchFeedCaches(postId, !isLiked);
    },
  });

  const { mutate } = mutation;

  const toggle = useCallback(
    (postId: number, currentIsLiked: boolean) => {
      mutate({ postId, isLiked: !currentIsLiked });
    },
    [mutate]
  );

  return { ...mutation, toggle };
}
