import { Gender } from "@/common/types/gender";
import { SocialType } from "@/features/auth/components/SocialButton/SocialButton";

export interface EditableUserInfo {
  nickname: string;
  phoneNumber: string;
  birthday: string;
  gender: Gender;
  profileImageUrl: string;
  marketingAgree: boolean;
}
export interface User extends EditableUserInfo {
  id: number;
  couponCount: number;
  followingCount: number;
  point: number;
  reviewCount: number;
  email: string;
  providerType: SocialType;
  roleType: string; // TODO : 권한 타입 추가
  createdAt: Date;
  modifiedAt: Date;
  /**
   * 마이 「주문 현황」 4단계 — 단계별 주문 수(back-end UserOrderStats, e316f423). 기간 제한 없음.
   * 취소 요청 중 · 반품/교환 진행 중 항목은 어느 단계에도 세지 않는다. 옛 서버 응답에는 없을 수 있다.
   */
  orderStats?: UserOrderStats;
}

export interface UserOrderStats {
  paid: number;
  preparing: number;
  shipping: number;
  delivered: number;
}

export type CheckNicknameCode = "AVAILABLE" | "DUPLICATE" | "PROFANITY" | "INVALID_FORMAT";

export interface CheckNicknameResponse<C extends CheckNicknameCode> {
  isAvailable: boolean;
  code: C;
  message: string;
}

export type UpdateUserRequest = EditableUserInfo;
