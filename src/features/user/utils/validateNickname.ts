import { queryClient } from "@/common/lib/queryClient";
import { userService } from "@/features/user/services/userService";
import { CheckNicknameCode, CheckNicknameResponse } from "@/features/user/types/user";

export async function validateNickname(nickname: string): Promise<CheckNicknameCode> {
  const cachedResponse = await queryClient.getQueryData<CheckNicknameResponse<CheckNicknameCode>>([
    "checkNickname",
    nickname,
  ]);

  if (cachedResponse) {
    return cachedResponse.code;
  }

  const response = await userService.checkNickname(nickname);

  await queryClient.setQueryData(["checkNickname", nickname], response);
  await queryClient.invalidateQueries({ queryKey: ["checkNickname"] });

  return response.code;
}
