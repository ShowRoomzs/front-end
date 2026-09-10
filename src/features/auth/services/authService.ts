import { authInstance } from "@/common/lib/authInstance";
import { refreshInstance } from "@/common/lib/refreshInstance";
import { IS_DEMO } from "@/demo/config";
import { demoAuthService } from "@/demo/services/account";
import {
  RegisterRequest,
  RegisterResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/features/auth/types/auth";

const realAuthService = {
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

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realAuthService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const authService: typeof realAuthService = IS_DEMO
  ? { ...realAuthService, ...demoAuthService }
  : realAuthService;
