import { useMutation } from "@tanstack/react-query";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { settingService } from "@/features/setting/services/settingService";

export function useWithdrawlMutation() {
  const { logout } = useLogin();

  return useMutation({
    mutationFn: settingService.withdrawal,
    onSuccess: logout,
  });
}
