import { apiInstance } from "@/common/lib/apiInstance";
import { User } from "@/features/user/types/user";

export type CheckNicknameCode = "AVAILABLE" | "DUPLICATE" | "PROFANITY" | "INVALID_FORMAT";
export interface CheckNicknameResponse<C extends CheckNicknameCode> {
  isAvailable: boolean;
  code: C;
  message: string;
}

export const userService = {
  getUserInfo: async (): Promise<User> => {
    const { data: response } = await apiInstance.get<User>("/users/me");

    return response;
  },
  checkNickname: async (nickname: string): Promise<CheckNicknameResponse<CheckNicknameCode>> => {
    const { data: response } = await apiInstance.get<CheckNicknameResponse<CheckNicknameCode>>(
      "/users/check-nickname",
      {
        params: {
          nickname,
        },
      }
    );

    return response;
  },
};
