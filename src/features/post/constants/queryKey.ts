export const POST_QUERY_KEY = {
  FOLLOWING_FEED: "followingFeed",
  RECOMMENDED_FEED: "recommendedFeed",
  LIKED_POSTS: "likedPosts",
  POST_DETAIL: "postDetail",
  SHOWROOM_POSTS: "showroomPosts",
  /** C4 상단 「진행 중인 공구」 — 페이징 없는 배열이라 위 피드 캐시와 모양이 다르다 */
  SHOWROOM_GROUP_BUY_POSTS: "showroomGroupBuyPosts",
  REPORT_REASONS: "postReportReasons",
} as const;
