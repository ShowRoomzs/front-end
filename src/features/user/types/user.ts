import { Gender } from "@/common/types/gender";
import { SocialType } from "@/features/auth/components/SocialButton/SocialButton";

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  birthday: string;
  gender: Gender;
  providerType: SocialType;
  roleType: string; // TODO : 권한 타입 추가
  createdAt: Date;
  modifiedAt: Date;
  marketingAgree: boolean;
}

export type CheckNicknameCode = "AVAILABLE" | "DUPLICATE" | "PROFANITY" | "INVALID_FORMAT";

export interface CheckNicknameResponse<C extends CheckNicknameCode> {
  isAvailable: boolean;
  code: C;
  message: string;
}
