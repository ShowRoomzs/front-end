import { apiInstance } from "@/common/lib/apiInstance";
import { CheckNicknameCode, CheckNicknameResponse, User } from "@/features/user/types/user";

export const userService = {
  getUserInfo: async (): Promise<User> => {
    const { data: response } = await apiInstance.get<User>("/user/me");

    return response;
  },
  checkNickname: async (nickname: string): Promise<CheckNicknameResponse<CheckNicknameCode>> => {
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
