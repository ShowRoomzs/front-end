import { authInstance } from "@/common/lib/authInstance";
import { refreshInstance } from "@/common/lib/refreshInstance";
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

export const authService = {
  socialLogin: async (request: SocialLoginRequest): Promise<SocialLoginResponse> => {
    const { data: response } = await authInstance.post<SocialLoginResponse>("/social/login", request);

    return response;
  },
  register: async (request: RegisterRequest, registerToken: string): Promise<RegisterResponse> => {
    const { data: response } = await authInstance.post<RegisterResponse>("/register", request, {
      headers: {
        Authorization: `Bearer ${registerToken}`,
      },
    });

    return response;
  },
  refresh: async (refreshToken: string): Promise<RegisterResponse> => {
    const { data: response } = await refreshInstance.post<RegisterResponse>("/refresh", { refreshToken });

    return response;
  },
};
