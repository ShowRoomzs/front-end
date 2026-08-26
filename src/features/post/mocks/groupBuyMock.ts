import { FeedItem, GroupBuyInfo, PostDetail, PostProduct } from "@/features/post/types/post";

/**
 * ⚠️ 임시 목업 — 공구 게시물 화면을 먼저 그려 두기 위한 자리다.
 *
 * 서버 `PostDto`에는 제목·상품 목록·D-day·대가관계 표시가 **아직 없다**(`contentType`은 항상
 * `"GENERAL"`). 그래서 C1 카드 · C3 목록 · C5 상세의 공구 형태를 실물로 확인할 방법이 없어,
 * 응답을 받은 직후 이 파일에서 덧씌운다.
 *
 * **삭제하는 법** — 서버가 필드를 내려주기 시작하면 `postService`에서 `withGroupBuyMock` ·
 * `withGroupBuyDetailMock` 호출 5줄과 이 파일을 지우면 끝난다. 화면과 컴포넌트는 그대로 둔다.
 *
 * 값은 `postId`로 결정한다 — 매번 달라지면 스크롤할 때마다 카드가 바뀌어 검토가 안 된다.
 */
const MOCK_TITLES = [
  "여름 내 무너진 장벽, 3주면 돌아옵니다",
  "가진 걸 정리부터 다시, 순한 성분만 골랐어요",
  "아침 루틴 정리했어요, 세 단계면 충분해요",
];

const MOCK_PRODUCTS: Array<Omit<PostProduct, "productId" | "soldOut">> = [
  {
    name: "시카 리페어 앰플 30ml 리필 2개 세트 기획 · 토너 패드 증정",
    imageUrl: null,
    listPrice: 38000,
    price: 24900,
    discountRate: 34,
  },
  {
    name: "진정 토너 패드 60매",
    imageUrl: null,
    listPrice: 26000,
    price: 17500,
    discountRate: 33,
  },
  {
    name: "배리어 크림 50ml 대용량 리뉴얼",
    imageUrl: null,
    listPrice: 32000,
    price: 21900,
    discountRate: 32,
  },
];

/** 3개 중 1개꼴로 공구 게시물이 섞이게 한다 — 피드에 두 형태가 함께 보여야 비교가 된다 */
function isGroupBuyPost(postId: number) {
  return postId % 3 === 0;
}

function buildGroupBuy(postId: number): GroupBuyInfo {
  const productCount = (postId % 3) + 1;
  // 6개마다 한 번은 마감된 공구 — 죽은 표기(회색 배지·회색 하트·품절 오버레이)를 확인하려고 둔다
  const isClosed = postId % 6 === 0;

  return {
    title: MOCK_TITLES[postId % MOCK_TITLES.length],
    dday: (postId % 7) + 1,
    status: isClosed ? "CLOSED" : "OPEN",
    isPaidAd: postId % 2 === 0,
    products: MOCK_PRODUCTS.slice(0, productCount).map((product, index) => ({
      ...product,
      productId: postId * 10 + index,
      soldOut: isClosed || (postId % 5 === 0 && index === 0),
    })),
  };
}

export function withGroupBuyMock<T extends { content: Array<FeedItem> }>(page: T): T {
  return {
    ...page,
    content: page.content.map(item =>
      isGroupBuyPost(item.post.postId)
        ? {
            ...item,
            contentType: "GROUP_BUY" as const,
            post: { ...item.post, groupBuy: buildGroupBuy(item.post.postId) },
          }
        : item
    ),
  };
}

export function withGroupBuyDetailMock(detail: PostDetail): PostDetail {
  if (!isGroupBuyPost(detail.postId)) {
    return detail;
  }
  return { ...detail, groupBuy: buildGroupBuy(detail.postId) };
}
