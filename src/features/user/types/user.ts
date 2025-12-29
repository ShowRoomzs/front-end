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
