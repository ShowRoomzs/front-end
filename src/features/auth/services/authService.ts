import { authInstance } from "@/common/lib/authInstance";

export interface SocialLoginRequest {
  providerType: string;
  token: string;
  name?: string;
  fcmToken?: string;
}

export interface SocialLoginResponse {
  isNewMember: boolean;
  registerToken?: string;

  tokenType?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
}

export const authService = {
  socialLogin: async (request: SocialLoginRequest): Promise<SocialLoginResponse> => {
    const { data: response } = await authInstance.post<SocialLoginResponse>("/v1/auth/social/login", request);

    return response;
  },
};
