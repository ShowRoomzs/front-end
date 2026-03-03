import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";
import { UpdateRefundAccountRequest } from "@/features/setting/types/refundAccount";

export function useUpdateRefundAccountMutation() {
  return useMutation({
    mutationFn: (data: UpdateRefundAccountRequest) => settingService.updateRefundAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTING_QUERY_KEY.REFUND_ACCOUNT] });
    },
  });
}
