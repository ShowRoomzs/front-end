import { useMutation } from "@tanstack/react-query";

import { ErrorResponse } from "@/common/types/error";
import {
  authService,
  type RegisterRequest,
  type RegisterResponse,
} from "@/features/auth/services/authService";

export function useRegisterMutation() {
  const registerMutation = useMutation<
    RegisterResponse,
    ErrorResponse<unknown>,
    { request: RegisterRequest; registerToken: string }
  >({
    mutationFn: ({ request, registerToken }) => authService.register(request, registerToken),
  });

  return registerMutation;
}
