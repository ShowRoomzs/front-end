import { apiInstance } from "@/common/lib/apiInstance";
import {
  CheckNicknameCode,
  CheckNicknameResponse,
  UpdateUserRequest,
  User,
} from "@/features/user/types/user";

export const userService = {
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
