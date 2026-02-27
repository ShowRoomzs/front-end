import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/common/stores/useUserStore";
import { userService } from "@/features/user/services/userService";
import { UpdateUserRequest } from "@/features/user/types/user";

export function useUpdateUserMutation() {
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.update(data),
    onSuccess: async () => {
      const userInfo = await userService.get();

      setUser(userInfo);
    },
  });
}
