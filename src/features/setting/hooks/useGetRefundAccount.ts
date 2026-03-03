import { useQuery } from "@tanstack/react-query";

import { SETTING_QUERY_KEY } from "@/features/setting/constants/queryKey";
import { settingService } from "@/features/setting/services/settingService";

export function useGetRefundAccount() {
  return useQuery({
    queryKey: [SETTING_QUERY_KEY.REFUND_ACCOUNT],
    queryFn: settingService.getRefundAccount,
  });
}
