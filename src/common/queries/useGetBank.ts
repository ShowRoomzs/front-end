import { useQuery } from "@tanstack/react-query";

import { BANK_QUERY_KEY } from "@/common/constants/queryKey";
import { bankService } from "@/common/services/bankService";

export function useGetBank() {
  return useQuery({
    queryKey: [BANK_QUERY_KEY.BANKS],
    queryFn: bankService.get,
  });
}
