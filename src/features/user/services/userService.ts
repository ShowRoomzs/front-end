import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";
import { demoUserService } from "@/demo/services/account";
import {
  CheckNicknameCode,
  CheckNicknameResponse,
  UpdateUserRequest,
  User,
} from "@/features/user/types/user";

const realUserService = {
  get: async () => {
    const { data: response } = await apiInstance.get<User>("/user/me");

    return response;
  },
  update: async (data: UpdateUserRequest) => {
    const { data: response } = await apiInstance.patch<User>("/user/me", data);

    return response;
  },
  checkNickname: async (nickname: string) => {
    const { data: response } = await apiInstance.get<CheckNicknameResponse<CheckNicknameCode>>(
      "/user/check-nickname",
      {
        params: {
          nickname,
        },
      }
    );

    return response;
  },
};

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realUserService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const userService: typeof realUserService = IS_DEMO
  ? { ...realUserService, ...demoUserService }
  : realUserService;
