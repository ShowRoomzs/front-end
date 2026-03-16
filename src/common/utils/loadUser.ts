import { useUserStore } from "@/common/stores/useUserStore";
import { userService } from "@/features/user/services/userService";
import { User } from "@/features/user/types/user";

/**
 * 유저 정보를 로드하여 Zustand store에 저장하고, 반환하는 유틸리티 함수
 */
export async function loadUser(): Promise<User> {
  const userInfo = await userService.get();

  useUserStore.getState().setUser(userInfo);

  return userInfo;
}
