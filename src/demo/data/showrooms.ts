import { DEMO_SHOWROOM_IMAGE } from "@/demo/images";

/**
 * 데모 쇼룸 6곳.
 *
 * 4곳은 팔로우한 상태(홈 팔로잉 피드가 채워진다), 2곳은 팔로우하지 않은 상태로 두어
 * "회원님을 위한 추천" 영역과 카드 헤더의 팔로우 버튼이 함께 보이게 했다.
 *
 * 공구 진행 여부도 갈라 두었다 — 아바타 로즈 링이 있는 쇼룸과 없는 쇼룸이 한 화면에 섞여야
 * 그 표시가 무엇을 뜻하는지 설명 없이 읽힌다.
 */
export interface DemoShowroom {
  showroomId: number;
  showroomName: string;
  showroomAddress: string;
  showroomImageUrl: string;
  introduction: string;
  instagramUrl: string | null;
  followerCount: number;
  /** 초기 팔로우 상태 — 이후 변경은 `demoStore`가 들고 있는다 */
  isFollowing: boolean;
  /** 진행 중인 공구를 가진 쇼룸 */
  hasOngoingGroupBuy: boolean;
}

export const DEMO_SHOWROOMS: Array<DemoShowroom> = [
  {
    showroomId: 1,
    showroomName: "제니의 뷰티룸",
    showroomAddress: "jenny_beauty",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.jenny,
    introduction: "민감성 피부 12년차. 직접 3주 이상 써 본 것만 올립니다.",
    instagramUrl: "https://www.instagram.com/jenny_beauty",
    followerCount: 12480,
    isFollowing: true,
    hasOngoingGroupBuy: true,
  },
  {
    showroomId: 2,
    showroomName: "하루 코스메틱",
    showroomAddress: "haru_cosmetic",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.haru,
    introduction: "성분표부터 읽는 클린뷰티. 순한 것만 골라 옵니다.",
    instagramUrl: "https://www.instagram.com/haru_cosmetic",
    followerCount: 8320,
    isFollowing: true,
    hasOngoingGroupBuy: true,
  },
  {
    showroomId: 3,
    showroomName: "미아 스킨노트",
    showroomAddress: "mia_skinnote",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.mia,
    introduction: "화장품 연구원 출신. 성분과 함량으로 이야기합니다.",
    instagramUrl: "https://www.instagram.com/mia_skinnote",
    followerCount: 5140,
    isFollowing: true,
    hasOngoingGroupBuy: false,
  },
  {
    showroomId: 4,
    showroomName: "윤의 클린뷰티",
    showroomAddress: "yoon_clean",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.yoon,
    introduction: "예민한 피부를 위한 최소한의 루틴을 찾습니다.",
    instagramUrl: null,
    followerCount: 3970,
    isFollowing: true,
    hasOngoingGroupBuy: false,
  },
  {
    showroomId: 5,
    showroomName: "소연의 바디랩",
    showroomAddress: "soyeon_bodylab",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.soyeon,
    introduction: "샤워 뒤 30분이 하루를 좌우합니다. 바디 제품만 골라 옵니다.",
    instagramUrl: "https://www.instagram.com/soyeon_bodylab",
    followerCount: 21600,
    isFollowing: false,
    hasOngoingGroupBuy: true,
  },
  {
    showroomId: 6,
    showroomName: "다은의 헤어살롱",
    showroomAddress: "daeun_hair",
    showroomImageUrl: DEMO_SHOWROOM_IMAGE.daeun,
    introduction: "살롱에서 실제로 쓰는 제품만 소개합니다.",
    instagramUrl: "https://www.instagram.com/daeun_hair",
    followerCount: 6880,
    isFollowing: false,
    hasOngoingGroupBuy: true,
  },
];

export const DEMO_SHOWROOM_BY_ID = new Map(DEMO_SHOWROOMS.map(showroom => [showroom.showroomId, showroom]));

export function demoShowroom(showroomId: number): DemoShowroom {
  return DEMO_SHOWROOM_BY_ID.get(showroomId) ?? DEMO_SHOWROOMS[0];
}
