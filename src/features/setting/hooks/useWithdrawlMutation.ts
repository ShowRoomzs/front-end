import { useMutation } from "@tanstack/react-query";

import { settingService } from "@/features/setting/services/settingService";

export function useWithdrawlMutation() {
  return useMutation({
    mutationFn: settingService.withdrawal,
  });
}
