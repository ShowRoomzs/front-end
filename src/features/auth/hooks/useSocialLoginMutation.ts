import { useMutation } from "@tanstack/react-query";

import { authService } from "@/features/auth/services/authService";

export function useSocialLoginMutation() {
  const socialLoginMutation = useMutation({
    mutationFn: authService.socialLogin,
  });

  return socialLoginMutation;
}
