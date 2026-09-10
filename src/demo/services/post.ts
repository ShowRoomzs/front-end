import { PageParams } from "@/common/types/page";
import { demoDelay } from "@/demo/config";
import { DEMO_POSTS, DEMO_POST_BY_ID, DemoPostSeed } from "@/demo/data/posts";
import { demoProduct } from "@/demo/data/products";
import { demoShowroom } from "@/demo/data/showrooms";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import {
  FeedItem,
  GroupBuyInfo,
  LikedPostSort,
  PostDetail,
  PostListItem,
  PostProduct,
  PostReportReasonItem,
} from "@/features/post/types/post";

/**
 * 데모 피드.
 *
 * 팔로우·좋아요 상태는 데이터가 아니라 `demoStore`에서 읽는다 — 시연 중에 하트를 누르거나
 * 팔로우를 끊으면 목록을 다시 받아도 그 결과가 유지돼야 한다.
 */

function toProducts(seed: DemoPostSeed): Array<PostProduct> {
  const groupBuy = seed.groupBuy;

  if (!groupBuy) {
    return [];
  }

  return groupBuy.productIds.map(productId => {
    const product = demoProduct(productId);

    return {
      productId,
      name: product.name,
      imageUrl: product.representativeImageUrl,
      listPrice: product.regularPrice,
      price: product.salePrice,
      discountRate: product.discountRate,
      soldOut: groupBuy.status === "CLOSED" || (groupBuy.soldOutProductIds ?? []).includes(productId),
    };
  });
}

function toGroupBuy(seed: DemoPostSeed): GroupBuyInfo | null {
  if (!seed.groupBuy) {
    return null;
  }

  return {
    title: seed.groupBuy.title,
    dday: seed.groupBuy.dday,
    status: seed.groupBuy.status,
    isPaidAd: seed.groupBuy.isPaidAd,
    products: toProducts(seed),
  };
}

function toPost(seed: DemoPostSeed): PostListItem {
  const showroom = demoShowroom(seed.showroomId);
  const isLiked = demoStore.isLiked(seed.postId);
  const groupBuy = toGroupBuy(seed);

  return {
    postId: seed.postId,
    showroomId: showroom.showroomId,
    showroomName: showroom.showroomName,
    showroomImageUrl: showroom.showroomImageUrl,
    isFollowing: demoStore.isFollowing(showroom.showroomId),
    hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
    content: seed.content,
    imageUrls: seed.images,
    imageCount: seed.images.length,
    aspectRatio: seed.aspectRatio,
    impressionCount: seed.impressionCount,
    isLiked,
    // 시연 중에 누른 하트가 숫자에도 반영돼야 "내가 눌렀다"가 읽힌다
    likeCount: seed.likeCount + (isLiked && !seed.isLiked ? 1 : 0) - (!isLiked && seed.isLiked ? 1 : 0),
    likeLocked: groupBuy?.status === "CLOSED",
    publishedAt: seed.publishedAt,
    groupBuy,
  };
}

function toFeedItem(seed: DemoPostSeed): FeedItem {
  return {
    contentType: seed.groupBuy ? "GROUP_BUY" : "GENERAL",
    post: toPost(seed),
  };
}

function sortLiked(seeds: Array<DemoPostSeed>, sort?: LikedPostSort): Array<DemoPostSeed> {
  const items = [...seeds];

  if (sort === "LIKED_OLDEST") {
    return items.reverse();
  }
  if (sort === "MOST_LIKED") {
    return items.sort((a, b) => b.likeCount - a.likeCount);
  }
  if (sort === "GROUP_BUY_FIRST") {
    return items.sort((a, b) => Number(!!b.groupBuy) - Number(!!a.groupBuy));
  }
  return items;
}

export const demoPostService = {
  getFollowingFeed: (params: PageParams) => {
    const followed = demoStore.followedShowroomIds();
    const seeds = DEMO_POSTS.filter(seed => followed.includes(seed.showroomId));

    return demoDelay(demoPage(seeds.map(toFeedItem), params));
  },

  getRecommendedFeed: (params: PageParams) => {
    const followed = demoStore.followedShowroomIds();
    const seeds = DEMO_POSTS.filter(seed => !followed.includes(seed.showroomId));

    return demoDelay(demoPage(seeds.map(toFeedItem), params));
  },

  getLikedPosts: (params: PageParams & { sort?: LikedPostSort }) => {
    const liked = demoStore.likedPostIds();
    const seeds = sortLiked(
      DEMO_POSTS.filter(seed => liked.includes(seed.postId)),
      params.sort
    );

    return demoDelay(demoPage(seeds.map(toFeedItem), params));
  },

  getShowroomPosts: (showroomId: number, params: PageParams) => {
    const seeds = DEMO_POSTS.filter(seed => seed.showroomId === showroomId);

    return demoDelay(demoPage(seeds.map(toFeedItem), params));
  },

  getPostDetail: (postId: number): Promise<PostDetail> => {
    const seed = DEMO_POST_BY_ID.get(postId) ?? DEMO_POSTS[0];
    const post = toPost(seed);

    return demoDelay({ ...post, modifiedAt: post.publishedAt });
  },

  like: async (postId: number) => {
    demoStore.setLiked(postId, true);
  },

  unlike: async (postId: number) => {
    demoStore.setLiked(postId, false);
  },

  getReportReasons: (): Promise<Array<PostReportReasonItem>> =>
    demoDelay([
      { code: "AD_DISCLOSURE", label: "대가관계 미표시", detailRequired: false },
      { code: "MEDICAL_CLAIM", label: "의학적 효능 표현", detailRequired: false },
      { code: "MISLEADING_AD", label: "허위·과장 광고", detailRequired: false },
      { code: "COPYRIGHT", label: "저작권 침해", detailRequired: false },
      { code: "SEXUAL_CONTENT", label: "선정적인 내용", detailRequired: false },
      { code: "VIOLENCE_HATE", label: "폭력·혐오 표현", detailRequired: false },
      { code: "PERSONAL_INFO", label: "개인정보 노출", detailRequired: false },
      { code: "OTHER", label: "기타", detailRequired: true },
    ]),

  report: async () => undefined,

  recordImpressions: async () => undefined,
};
