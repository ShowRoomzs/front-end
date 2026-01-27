import { useMutation } from "@tanstack/react-query";

import { ErrorResponse } from "@/common/types/error";
import { authService } from "@/features/auth/services/authService";
import { RegisterRequest, RegisterResponse } from "@/features/auth/types/auth";

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
