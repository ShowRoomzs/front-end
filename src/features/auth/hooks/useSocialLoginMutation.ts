import { useMutation } from "@tanstack/react-query";

import type { ErrorResponse } from "@/common/types/error";

import {
  authService,
  type SocialLoginRequest,
  type SocialLoginResponse,
} from "@/features/auth/services/authService";

export function useSocialLoginMutation() {
  const socialLoginMutation = useMutation<SocialLoginResponse, ErrorResponse, SocialLoginRequest>({
    mutationFn: authService.socialLogin,
  });

  return socialLoginMutation;
}
