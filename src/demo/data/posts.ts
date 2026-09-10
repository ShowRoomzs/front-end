import { DEMO_POST_IMAGE } from "@/demo/images";

/**
 * 데모 게시물 18건 — 공구 5 · 일반 13.
 *
 * 팔로우한 쇼룸(1~4)의 게시물이 홈 팔로잉 피드를, 팔로우하지 않은 쇼룸(5~6)의 게시물이
 * "회원님을 위한 추천"을 채운다. 두 영역 사이에 "새 게시물을 모두 확인했어요" 블록이 들어가는
 * 구조라, 팔로잉 쪽을 다 내리면 자연스럽게 발견 피드로 이어진다.
 *
 * **마감된 공구를 하나 섞었다**(`p105`) — 회색 배지 · 흐려진 카드 · 잠긴 하트가 한 화면에서
 * 살아 있는 공구와 나란히 보여야 그 규칙이 설명 없이 읽힌다.
 *
 * 쇼룸마다 다루는 제품군을 갈라 두었다. 사진이 그 쇼룸 것처럼 보여야 한 사람이 운영하는
 * 계정으로 읽히기 때문이다.
 *
 * | 쇼룸 | 다루는 것 | 공구 |
 * | --- | --- | --- |
 * | 1 제니의 뷰티룸 | 아누아 진정 라인 | D-3 |
 * | 2 하루 코스메틱 | 세타필 · AHC 보습 | D-5 (광고) |
 * | 3 미아 스킨노트 | 성분 이야기 | 없음 |
 * | 4 윤의 클린뷰티 | 미니멀 루틴 | 마감 |
 * | 5 소연의 바디랩 | 온더바디 · 폴메디슨 | D-1 (광고) |
 * | 6 다은의 헤어살롱 | 엘라스틴 · 케라시스 | D-7 |
 */

const HOUR = 1000 * 60 * 60;
const NOW = Date.now();

/** 데모를 여는 시각 기준으로 상대 시간을 만든다 — "3일 전"이 빌드 날짜에 묶이지 않게 */
function hoursAgo(hours: number): string {
  return new Date(NOW - hours * HOUR).toISOString();
}

export interface DemoGroupBuySeed {
  title: string;
  dday: number;
  status: "OPEN" | "CLOSED";
  isPaidAd: boolean;
  /** `DEMO_PRODUCTS`의 id */
  productIds: Array<number>;
  /** 이 공구에서 품절된 상품 */
  soldOutProductIds?: Array<number>;
}

export interface DemoPostSeed {
  postId: number;
  showroomId: number;
  images: Array<string>;
  content: string;
  aspectRatio: number;
  likeCount: number;
  impressionCount: number;
  publishedAt: string;
  /** 초기 좋아요 상태 — 이후 변경은 `demoStore`가 들고 있는다 */
  isLiked: boolean;
  groupBuy?: DemoGroupBuySeed;
}

const P = DEMO_POST_IMAGE;

/** 브랜드 공식 컷이 대부분 정사각이라 카드도 1:1로 잡는다 */
const RATIO = 1;

export const DEMO_POSTS: Array<DemoPostSeed> = [
  {
    postId: 101,
    showroomId: 1,
    images: [P.p01, P.p02],
    content:
      "여름 내내 자외선이랑 냉방으로 올라온 붉은기, 어성초 두 단계면 잡힙니다. 제가 두 달 아침저녁으로 쓴 조합이에요. 토너로 결을 정리하고 세럼으로 눌러 주는 순서입니다. 배송은 다음 주 월요일부터 순차로 나갑니다.",
    aspectRatio: RATIO,
    likeCount: 342,
    impressionCount: 8210,
    publishedAt: hoursAgo(2),
    isLiked: true,
    groupBuy: {
      title: "어성초 77, 붉은기 잡는 두 단계",
      dday: 3,
      status: "OPEN",
      isPaidAd: false,
      productIds: [1002, 1001],
    },
  },
  {
    postId: 102,
    showroomId: 3,
    images: [P.p10],
    content:
      "성분표 읽는 법 정리했어요. 앞에서 다섯 번째까지가 실제로 피부에 닿는 대부분이고, 그 뒤는 함량이 급격히 떨어집니다. 마케팅 성분이 뒤쪽에 몰려 있으면 한 번 의심해 보세요.",
    aspectRatio: RATIO,
    likeCount: 128,
    impressionCount: 3140,
    publishedAt: hoursAgo(6),
    isLiked: false,
  },
  {
    postId: 103,
    showroomId: 2,
    images: [P.p03, P.p04],
    content:
      "건조한 계절 들어가기 전에 보습부터 채워 두는 게 낫습니다. 얼굴이랑 몸에 같이 쓰는 대용량 크림이랑, 그 앞 단계 로션 두 가지를 열었어요. 둘 다 제가 작년 겨울에 한 통씩 다 쓴 것들입니다.",
    aspectRatio: RATIO,
    likeCount: 216,
    impressionCount: 5620,
    publishedAt: hoursAgo(20),
    isLiked: false,
    groupBuy: {
      title: "건조한 계절, 대용량 보습 두 가지",
      dday: 5,
      status: "OPEN",
      isPaidAd: true,
      productIds: [1004, 1003],
    },
  },
  {
    postId: 104,
    showroomId: 1,
    images: [P.p11],
    content: "어성초 세럼 4주차 기록. 붉은기가 확실히 가라앉았어요. 사진은 같은 조명, 같은 시간대입니다.",
    aspectRatio: RATIO,
    likeCount: 189,
    impressionCount: 4380,
    publishedAt: hoursAgo(30),
    isLiked: true,
  },
  {
    postId: 105,
    showroomId: 4,
    images: [P.p05],
    content:
      "지난 대용량 크림 공구는 마감됐습니다. 참여해 주신 분들 감사해요. 다음 공구는 이번 달 말에 다시 열 예정입니다.",
    aspectRatio: RATIO,
    likeCount: 94,
    impressionCount: 2210,
    publishedAt: hoursAgo(54),
    isLiked: false,
    groupBuy: {
      title: "대용량 보습 크림 공구",
      dday: 0,
      status: "CLOSED",
      isPaidAd: false,
      // 끝난 공구는 상품 묶음을 그리지 않는다(시안 C3의 종료 카드) — 살 수 없는 줄을 다시 세울 이유가 없다
      productIds: [],
    },
  },
  {
    postId: 106,
    showroomId: 3,
    images: [P.p12],
    content:
      "무향·무색소가 왜 중요한지 자주 물어보셔서. 향료는 성분표 맨 뒤에 한 줄로 적히지만 자극 원인의 상위권입니다. 예민한 시기에는 그 한 줄부터 빼 보세요.",
    aspectRatio: RATIO,
    likeCount: 151,
    impressionCount: 3890,
    publishedAt: hoursAgo(72),
    isLiked: false,
  },
  {
    postId: 107,
    showroomId: 2,
    images: [P.p13],
    content: "로션은 토너 다음, 크림 전 단계입니다. 이 순서만 지켜도 겉도는 느낌이 확 줄어요.",
    aspectRatio: RATIO,
    likeCount: 273,
    impressionCount: 6740,
    publishedAt: hoursAgo(96),
    isLiked: true,
  },
  {
    postId: 108,
    showroomId: 1,
    images: [P.p14],
    content: "토너는 화장솜에 충분히 적셔서 결을 따라 닦아 내세요. 아끼면 오히려 자극이 됩니다.",
    aspectRatio: RATIO,
    likeCount: 118,
    impressionCount: 2960,
    publishedAt: hoursAgo(120),
    isLiked: false,
  },
  {
    postId: 109,
    showroomId: 4,
    images: [P.p15],
    content:
      "겨울 준비 시작합니다. 여름 루틴 그대로 가면 10월부터 당겨요. 단계를 늘리기 전에 토너를 얇게 두세 번 겹쳐 보세요.",
    aspectRatio: RATIO,
    likeCount: 87,
    impressionCount: 1980,
    publishedAt: hoursAgo(150),
    isLiked: false,
  },
  {
    postId: 110,
    showroomId: 3,
    images: [P.p16],
    content:
      "거품은 손에서 다 내고 얼굴에 올리는 겁니다. 얼굴 위에서 문지르면서 거품을 내면 그 마찰이 그대로 자극이에요.",
    aspectRatio: RATIO,
    likeCount: 205,
    impressionCount: 4720,
    publishedAt: hoursAgo(170),
    isLiked: false,
  },

  // ── 추천 피드 (팔로우하지 않은 쇼룸) ─────────────────────────────
  {
    postId: 201,
    showroomId: 5,
    images: [P.p06, P.p07],
    content:
      "샤워부터 바디로션까지 향을 하나로 맞추면 하루 종일 은은하게 남습니다. 바디워시는 세 향 중에 고르시고, 로션은 화이트머스크로 통일했어요.",
    aspectRatio: RATIO,
    likeCount: 486,
    impressionCount: 11200,
    publishedAt: hoursAgo(4),
    isLiked: false,
    groupBuy: {
      title: "샤워부터 로션까지, 향으로 맞추는 루틴",
      dday: 1,
      status: "OPEN",
      isPaidAd: true,
      productIds: [1006, 1005],
    },
  },
  {
    postId: 202,
    showroomId: 6,
    images: [P.p08, P.p09],
    content:
      "염색 자주 하시는 분들께. 샴푸로 단백질을 넣고 트리트먼트로 덮어 주는 순서가 맞습니다. 트리트먼트는 두피 말고 중간부터 끝까지만요.",
    aspectRatio: RATIO,
    likeCount: 312,
    impressionCount: 7430,
    publishedAt: hoursAgo(11),
    isLiked: false,
    groupBuy: {
      title: "극손상 모발, 살롱에서 쓰는 순서 그대로",
      dday: 7,
      status: "OPEN",
      isPaidAd: false,
      productIds: [1008, 1007],
      // 한 상품만 품절 — 공구는 열려 있는데 그 상품만 못 사는 경우를 보여 준다
      soldOutProductIds: [1007],
    },
  },
  {
    postId: 203,
    showroomId: 5,
    images: [P.p17],
    content: "세 향 중에 제일 무난한 건 로즈 & 피오니입니다. 남녀 상관없이 쓰기 좋아요.",
    aspectRatio: RATIO,
    likeCount: 398,
    impressionCount: 9120,
    publishedAt: hoursAgo(26),
    isLiked: false,
  },
  {
    postId: 204,
    showroomId: 6,
    images: [P.p18],
    content: "샴푸는 대용량이 답입니다. 아껴 쓰면 두피가 안 씻겨요. 두 번 감는 걸 권합니다.",
    aspectRatio: RATIO,
    likeCount: 164,
    impressionCount: 3620,
    publishedAt: hoursAgo(44),
    isLiked: false,
  },
  {
    postId: 205,
    showroomId: 5,
    images: [P.p19, P.p20],
    content: "라벤더는 자기 전에, 레몬은 아침에. 향으로 시간대를 나누면 샤워가 조금 달라집니다.",
    aspectRatio: RATIO,
    likeCount: 271,
    impressionCount: 6180,
    publishedAt: hoursAgo(68),
    isLiked: false,
  },
  {
    postId: 206,
    showroomId: 6,
    images: [P.p21],
    content: "케라마이드 4주 써 본 기록입니다. 3주차부터 손 빗질이 되기 시작했어요.",
    aspectRatio: RATIO,
    likeCount: 142,
    impressionCount: 3050,
    publishedAt: hoursAgo(90),
    isLiked: false,
  },
  {
    postId: 207,
    showroomId: 5,
    images: [P.p22],
    content: "바디로션은 물기 남아 있을 때 바르는 게 전부입니다. 다 닦고 바르면 겉돌아요.",
    aspectRatio: RATIO,
    likeCount: 108,
    impressionCount: 2480,
    publishedAt: hoursAgo(118),
    isLiked: false,
  },
  {
    postId: 208,
    showroomId: 6,
    images: [P.p23],
    content: "샴푸랑 트리트먼트는 같은 라인으로 맞추는 편이 낫습니다. 성분이 서로 물고 가게 설계돼 있어요.",
    aspectRatio: RATIO,
    likeCount: 96,
    impressionCount: 2140,
    publishedAt: hoursAgo(140),
    isLiked: false,
  },
];

export const DEMO_POST_BY_ID = new Map(DEMO_POSTS.map(post => [post.postId, post]));

/** 팔로우한 쇼룸의 게시물 — 홈 팔로잉 피드 */
export const DEMO_FOLLOWING_POST_IDS = DEMO_POSTS.filter(post => post.showroomId <= 4).map(
  post => post.postId
);

/** 팔로우하지 않은 쇼룸의 게시물 — 추천 피드 */
export const DEMO_RECOMMENDED_POST_IDS = DEMO_POSTS.filter(post => post.showroomId > 4).map(
  post => post.postId
);
