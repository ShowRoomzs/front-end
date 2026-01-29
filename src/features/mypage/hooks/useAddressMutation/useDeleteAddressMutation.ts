import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { MYPAGE_QUERY_KEY } from "@/features/mypage/constants/queryKey";
import { addressService } from "@/features/mypage/services/addressService";

export function useDeleteAddressMutation() {
  return useMutation({
    mutationFn: addressService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST] });
    },
  });
}
