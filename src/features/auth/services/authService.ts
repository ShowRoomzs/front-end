import { authInstance } from "@/common/lib/authInstance";
import { refreshInstance } from "@/common/lib/refreshInstance";
import {
  RegisterRequest,
  RegisterResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/features/auth/types/auth";

export const authService = {
  socialLogin: async (request: SocialLoginRequest): Promise<SocialLoginResponse> => {
    const { data: response } = await authInstance.post<SocialLoginResponse>("/social/login", request);

    return response;
  },
  register: async (request: RegisterRequest, registerToken: string): Promise<RegisterResponse> => {
    const { data: response } = await authInstance.post<RegisterResponse>("/social/signup", request, {
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
