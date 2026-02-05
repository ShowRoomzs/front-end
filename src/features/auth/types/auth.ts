import { Gender } from "@/common/types/gender";

export interface SocialLoginRequest {
  providerType: string;
  token: string;
  name?: string;
  fcmToken?: string;
}
export interface SocialLoginResponse extends RegisterResponse {
  isNewMember: boolean;
  registerToken?: string;
}

export interface RegisterRequest {
  nickname: string;
  gender: Gender;
  birthday: string;
  serviceAgree: boolean;
  privacyAgree: boolean;
  marketingAgree: boolean;
}

export interface RegisterResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}
