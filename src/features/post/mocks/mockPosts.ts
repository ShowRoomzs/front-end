/* eslint-disable @typescript-eslint/no-require-imports -- React Native 자산은 require()로만 번들에 실린다. import로 바꾸면 Metro가 파일을 찾지 못한다 */
import { Image, ImageSourcePropType } from "react-native";

import { PageResponse } from "@/common/types/page";
import { FeedItem, GroupBuyInfo, PostDetail, PostListItem } from "@/features/post/types/post";

/**
 * ⚠️ 임시 목업 — 피드를 채워 두기 위한 가짜 게시물 7건(공구 2 · 일반 5).
 *
 * **서버에 올린 데이터가 아니다.** 공구 게시물은 백엔드에 아직 없어서(`PostType.GROUP_BUY`가
 * "아직 만들지 않는다"로 비어 있고 피드 응답의 `contentType`은 항상 `"GENERAL"`이다)
 * 애초에 올릴 수가 없다. 그래서 응답을 받은 직후 이 파일에서 끼워 넣는다 —
 * 옆의 `groupBuyMock`이 기존 게시물에 공구 옷을 입히는 것과 같은 자리다.
 *
 * 사진은 데모 빌드에서 쓰던 브랜드 공식 컷을 그대로 가져왔다(`mocks/images/`).
 *
 * **삭제하는 법** — `postService`에서 `withMockPosts` · `mockPostDetail` 호출을 지우고
 * 이 파일과 `mocks/images/` 폴더를 지우면 끝난다. 화면과 컴포넌트는 그대로 둔다.
 */
function uri(source: ImageSourcePropType): string {
  return Image.resolveAssetSource(source)?.uri ?? "";
}

const IMAGE = {
  serumLeaf: uri(require("./images/post-01.jpg")),
  tonerSplash: uri(require("./images/post-02.jpg")),
  kerasysLine: uri(require("./images/post-08.jpg")),
  elastinePair: uri(require("./images/post-09.jpg")),
  serumFront: uri(require("./images/post-11.jpg")),
  ahcFront: uri(require("./images/post-13.jpg")),
  foam: uri(require("./images/post-16.jpg")),
  washRose: uri(require("./images/post-17.jpg")),
  washLavender: uri(require("./images/post-19.jpg")),
  kerasysFront: uri(require("./images/post-21.jpg")),
};

/**
 * 진짜 게시물과 절대 겹치지 않을 번호대.
 *
 * 상세로 들어갈 때 이 범위면 서버를 부르지 않고 목업을 돌려준다 — 서버에 없는 id라 404가 난다.
 */
const MOCK_ID_BASE = 990000;

export function isMockPostId(postId: number): boolean {
  return postId >= MOCK_ID_BASE;
}

const HOUR = 1000 * 60 * 60;

/** 앱을 여는 시각 기준으로 상대 시간을 만든다 — "3시간 전"이 빌드 날짜에 묶이지 않게 */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

interface Seed {
  offset: number;
  images: Array<string>;
  content: string;
  likeCount: number;
  impressionCount: number;
  hoursAgo: number;
  isLiked?: boolean;
  groupBuy?: GroupBuyInfo;
}

/** 사진이 전부 정사각(1080×1080)이라 카드도 1:1로 잡는다 */
const RATIO = 1;

const SEEDS: Array<Seed> = [
  {
    offset: 1,
    images: [IMAGE.serumLeaf, IMAGE.tonerSplash],
    content:
      "여름 내내 자외선이랑 냉방으로 올라온 붉은기, 어성초 두 단계면 잡힙니다. 토너로 결을 정리하고 세럼으로 눌러 주는 순서예요. 배송은 다음 주 월요일부터 순차로 나갑니다.",
    likeCount: 342,
    impressionCount: 8210,
    hoursAgo: 2,
    isLiked: true,
    groupBuy: {
      title: "어성초 77, 붉은기 잡는 두 단계",
      dday: 3,
      status: "OPEN",
      isPaidAd: false,
      products: [
        {
          productId: MOCK_ID_BASE + 101,
          name: "아누아 어성초 77 하이알루론 수딩 토너 150ml",
          imageUrl: IMAGE.tonerSplash,
          listPrice: 24000,
          price: 15900,
          discountRate: 34,
          soldOut: false,
        },
        {
          productId: MOCK_ID_BASE + 102,
          name: "아누아 어성초 77% 수딩 세럼 30ml",
          imageUrl: IMAGE.serumFront,
          listPrice: 32000,
          price: 19900,
          discountRate: 37,
          soldOut: false,
        },
      ],
    },
  },
  {
    offset: 2,
    images: [IMAGE.kerasysLine, IMAGE.elastinePair],
    content:
      "염색 자주 하시는 분들께. 샴푸로 단백질을 넣고 트리트먼트로 덮어 주는 순서가 맞습니다. 트리트먼트는 두피 말고 중간부터 끝까지만요.",
    likeCount: 312,
    impressionCount: 7430,
    hoursAgo: 9,
    groupBuy: {
      title: "극손상 모발, 살롱에서 쓰는 순서 그대로",
      dday: 7,
      status: "OPEN",
      isPaidAd: true,
      products: [
        {
          productId: MOCK_ID_BASE + 103,
          name: "케라시스 어드밴스드 케라마이드 앰플 트리트먼트 1000ml",
          imageUrl: IMAGE.kerasysFront,
          listPrice: 32000,
          price: 18900,
          discountRate: 41,
          soldOut: false,
        },
        {
          // 공구는 열려 있는데 이 상품만 못 사는 경우 — 품절 오버레이를 확인하려고 하나 둔다
          productId: MOCK_ID_BASE + 104,
          name: "엘라스틴 프로틴클리닉 10000 아르간오일 샴푸 1077ml",
          imageUrl: IMAGE.elastinePair,
          listPrice: 24000,
          price: 13900,
          discountRate: 42,
          soldOut: true,
        },
      ],
    },
  },

  // ── 일반 게시물 5건 ────────────────────────────────────────────
  {
    offset: 3,
    images: [IMAGE.serumFront],
    content: "어성초 세럼 4주차 기록. 붉은기가 확실히 가라앉았어요. 사진은 같은 조명, 같은 시간대입니다.",
    likeCount: 189,
    impressionCount: 4380,
    hoursAgo: 20,
    isLiked: true,
  },
  {
    offset: 4,
    images: [IMAGE.washRose, IMAGE.washLavender],
    content:
      "바디워시는 향으로 시간대를 나눠 보세요. 라벤더는 자기 전에, 로즈는 아무 때나. 샤워 뒤 30분쯤 지나면 은은하게만 남습니다.",
    likeCount: 271,
    impressionCount: 6180,
    hoursAgo: 31,
  },
  {
    offset: 5,
    images: [IMAGE.ahcFront],
    content: "로션은 토너 다음, 크림 전 단계입니다. 이 순서만 지켜도 겉도는 느낌이 확 줄어요.",
    likeCount: 273,
    impressionCount: 6740,
    hoursAgo: 48,
  },
  {
    offset: 6,
    images: [IMAGE.foam],
    content:
      "거품은 손에서 다 내고 얼굴에 올리는 겁니다. 얼굴 위에서 문지르면서 거품을 내면 그 마찰이 그대로 자극이에요.",
    likeCount: 205,
    impressionCount: 4720,
    hoursAgo: 70,
  },
  {
    offset: 7,
    images: [IMAGE.kerasysFront],
    content: "케라마이드 4주 써 본 기록입니다. 3주차부터 손 빗질이 되기 시작했어요.",
    likeCount: 142,
    impressionCount: 3050,
    hoursAgo: 96,
  },
];

/** 붙일 쇼룸 — 실제 응답에서 가져온다. 비어 있을 때만 쓰는 기본값이다 */
export interface MockShowroom {
  showroomId: number;
  showroomName: string;
  showroomImageUrl: string | null;
  isFollowing: boolean;
  hasOngoingGroupBuy: boolean;
}

const FALLBACK_SHOWROOM: MockShowroom = {
  showroomId: 1,
  showroomName: "김태호구글쇼룸",
  showroomImageUrl: null,
  isFollowing: true,
  hasOngoingGroupBuy: true,
};

function buildPost(seed: Seed, showroom: MockShowroom): PostListItem {
  return {
    postId: MOCK_ID_BASE + seed.offset,
    ...showroom,
    // 공구가 하나라도 있으면 아바타 로즈 링이 켜져야 말이 맞는다
    hasOngoingGroupBuy: showroom.hasOngoingGroupBuy || SEEDS.some(item => !!item.groupBuy),
    content: seed.content,
    imageUrls: seed.images,
    imageCount: seed.images.length,
    aspectRatio: RATIO,
    impressionCount: seed.impressionCount,
    isLiked: !!seed.isLiked,
    likeCount: seed.likeCount,
    likeLocked: seed.groupBuy?.status === "CLOSED",
    publishedAt: hoursAgo(seed.hoursAgo),
    groupBuy: seed.groupBuy ?? null,
  };
}

function toFeedItem(post: PostListItem): FeedItem {
  return { contentType: post.groupBuy ? "GROUP_BUY" : "GENERAL", post };
}

/**
 * 어느 피드에 넣을지.
 *
 * 홈 화면은 팔로잉을 다 내리면 추천으로 이어지므로 **둘 다 넣으면 같은 글이 두 번 보인다.**
 * 그래서 추천에는 넣지 않는다. 좋아요 탭에는 실제로 하트를 켜 둔 것만 넣는다 —
 * 안 누른 글이 좋아요 목록에 있으면 그 화면이 무엇을 모아 둔 곳인지 흐려진다.
 */
export type MockFeedSurface = "following" | "recommended" | "liked" | "showroom";

function seedsFor(surface: MockFeedSurface): Array<Seed> {
  if (surface === "recommended") {
    return [];
  }
  if (surface === "liked") {
    return SEEDS.filter(seed => seed.isLiked);
  }

  return SEEDS;
}

/**
 * 목업 게시물을 피드 맨 앞에 끼워 넣는다.
 *
 * **첫 페이지에만** 넣는다 — 페이지마다 넣으면 스크롤할 때 같은 카드가 계속 다시 나온다.
 * 쇼룸 정보는 응답의 첫 게시물에서 가져와, 어느 화면에서 보든 그 자리에 어울리는
 * 쇼룸의 글처럼 보이게 한다.
 */
export function withMockPosts(
  page: PageResponse<FeedItem>,
  pageNumber: number,
  surface: MockFeedSurface
): PageResponse<FeedItem> {
  const seeds = seedsFor(surface);

  if (pageNumber > 1 || seeds.length === 0) {
    return page;
  }

  const first = page.content[0]?.post;
  const showroom: MockShowroom = first
    ? {
        showroomId: first.showroomId,
        showroomName: first.showroomName,
        showroomImageUrl: first.showroomImageUrl,
        isFollowing: first.isFollowing,
        hasOngoingGroupBuy: first.hasOngoingGroupBuy,
      }
    : FALLBACK_SHOWROOM;

  const mocks = seeds.map(seed => toFeedItem(buildPost(seed, showroom)));

  return {
    ...page,
    pageInfo: {
      ...page.pageInfo,
      totalElements: page.pageInfo.totalElements + mocks.length,
    },
    content: [...mocks, ...page.content],
  };
}

/** 목업 게시물의 상세 — 서버에 없는 id라 부르면 404가 난다 */
export function mockPostDetail(postId: number): PostDetail {
  const seed = SEEDS.find(item => MOCK_ID_BASE + item.offset === postId) ?? SEEDS[0];
  const post = buildPost(seed, FALLBACK_SHOWROOM);

  return {
    postId: post.postId,
    showroomId: post.showroomId,
    showroomName: post.showroomName,
    showroomImageUrl: post.showroomImageUrl,
    content: post.content,
    imageUrls: post.imageUrls,
    imageCount: post.imageCount,
    aspectRatio: post.aspectRatio,
    impressionCount: post.impressionCount,
    isLiked: post.isLiked,
    likeCount: post.likeCount,
    likeLocked: post.likeLocked,
    publishedAt: post.publishedAt,
    modifiedAt: post.publishedAt,
    groupBuy: post.groupBuy,
  };
}
