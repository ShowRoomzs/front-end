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
}

export type CheckNicknameCode = "AVAILABLE" | "DUPLICATE" | "PROFANITY" | "INVALID_FORMAT";

export interface CheckNicknameResponse<C extends CheckNicknameCode> {
  isAvailable: boolean;
  code: C;
  message: string;
}

export type UpdateUserRequest = EditableUserInfo;
