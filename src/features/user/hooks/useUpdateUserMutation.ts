import { useMutation } from "@tanstack/react-query";

import { loadUser } from "@/common/utils/loadUser";
import { userService } from "@/features/user/services/userService";
import { UpdateUserRequest } from "@/features/user/types/user";

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.update(data),
    onSuccess: loadUser,
  });
}
