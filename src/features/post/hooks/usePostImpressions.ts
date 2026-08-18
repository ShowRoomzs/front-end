import { useCallback, useEffect, useRef } from "react";
import { ViewToken } from "react-native";

import { postService } from "@/features/post/services/postService";

/** 뷰포트에 이만큼 들어와야 "봤다"로 센다 */
export const IMPRESSION_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 500,
};

const FLUSH_INTERVAL_MS = 5000;

/**
 * 게시물 노출 적재.
 *
 * 카드 한 장이 뷰포트에 들어올 때마다 요청을 날리면 피드 스크롤에서 요청이 폭발하므로,
 * 본 게시물을 모아 일정 간격으로 한 번에 보낸다. 같은 사람이 같은 게시물을 다시 봐도
 * 30분 안이면 서버가 적재하지 않으므로 중복은 서버가 접는다 — 다만 같은 세션 안에서
 * 같은 ID를 반복해 보낼 이유는 없어 한 번 보낸 것은 클라이언트에서도 기억해 둔다.
 */
/** 목록 행이 게시물 그 자체가 아닐 수 있어(홈은 구분 블록·라벨이 섞인다) 추출을 밖에서 받는다 */
type PostIdExtractor = (row: unknown) => number | undefined;

const defaultExtractPostId: PostIdExtractor = row => {
  const candidate = row as { post?: { postId?: number }; item?: { post?: { postId?: number } } };

  return candidate?.post?.postId ?? candidate?.item?.post?.postId;
};

export function usePostImpressions(visitorId?: string, extractPostId = defaultExtractPostId) {
  const pendingRef = useRef<Set<number>>(new Set());
  const sentRef = useRef<Set<number>>(new Set());

  const flush = useCallback(() => {
    const postIds = Array.from(pendingRef.current);

    if (postIds.length === 0) {
      return;
    }
    pendingRef.current.clear();
    postIds.forEach(id => sentRef.current.add(id));

    // 지표 적재는 화면을 막지 않는다 — 실패해도 조용히 버린다
    void postService.recordImpressions(postIds, visitorId).catch(() => {
      postIds.forEach(id => sentRef.current.delete(id));
    });
  }, [visitorId]);

  useEffect(() => {
    const timer = setInterval(flush, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      flush();
    };
  }, [flush]);

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<ViewToken> }) => {
      info.viewableItems.forEach(token => {
        const postId = extractPostId(token.item);

        if (postId && !sentRef.current.has(postId)) {
          pendingRef.current.add(postId);
        }
      });
    },
    [extractPostId]
  );

  return { handleViewableItemsChanged, viewabilityConfig: IMPRESSION_VIEWABILITY_CONFIG };
}
