import { DEMO_USER_IMAGE } from "@/demo/images";
import { Address } from "@/features/mypage/types/address";
import { User } from "@/features/user/types/user";

/**
 * 데모 로그인 사용자.
 *
 * 앱을 켜면 이 사람으로 로그인된 상태에서 시작한다 — 미팅에서 소셜 로그인 화면부터 보여 줄
 * 이유가 없고, 로그인 장면이 필요하면 설정에서 로그아웃하면 된다(그때는 카카오·네이버 버튼이
 * 실제로 뜨고 서버 검증만 데모가 통과시킨다).
 *
 * 주문 현황은 네 단계 모두 0이다 — 주문 API가 없어 숫자를 눌러도 갈 곳이 없기 때문이고,
 * 마이 탭의 비활성 표기(회색 숫자 · 탭 불가)를 그대로 보여 주는 편이 정직하다.
 */
export const DEMO_USER: User = {
  id: 9001,
  nickname: "수민",
  phoneNumber: "010-2841-7736",
  birthday: "1996.04.18",
  gender: "FEMALE",
  profileImageUrl: DEMO_USER_IMAGE,
  marketingAgree: true,
  couponCount: 3,
  followingCount: 4,
  point: 2400,
  reviewCount: 0,
  email: "sumin@showroomz.example",
  providerType: "KAKAO",
  roleType: "USER",
  createdAt: new Date("2026-03-14T09:12:00"),
  modifiedAt: new Date("2026-08-02T14:30:00"),
};

export const DEMO_ADDRESSES: Array<Address> = [
  {
    id: 8001,
    recipientName: "이수민",
    zipCode: "06236",
    address: "서울특별시 강남구 테헤란로 152",
    detailAddress: "강남파이낸스센터 21층",
    phoneNumber: "010-2841-7736",
    memo: "부재 시 문 앞에 놓아주세요",
    default: true,
  },
  {
    id: 8002,
    recipientName: "이수민",
    zipCode: "04527",
    address: "서울특별시 중구 을지로 65",
    detailAddress: "SK텔레콤빌딩 3층 프론트",
    phoneNumber: "010-2841-7736",
    memo: null,
    default: false,
  },
];
