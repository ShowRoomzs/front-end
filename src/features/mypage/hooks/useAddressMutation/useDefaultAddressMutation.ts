import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { MYPAGE_QUERY_KEY } from "@/features/mypage/constants/queryKey";
import { addressService } from "@/features/mypage/services/addressService";

export function useDefaultAddressMutation() {
  return useMutation({
    mutationFn: addressService.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST] });
    },
  });
}
