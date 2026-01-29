import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/common/lib/queryClient";
import { MYPAGE_QUERY_KEY } from "@/features/mypage/constants/querykey";
import { addressService } from "@/features/mypage/services/addressService";
import { AddressRequest } from "@/features/mypage/types/address";

export function useUpdateAddressMutation() {
  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: number; address: AddressRequest }) =>
      addressService.updateAddress(addressId, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST] });
    },
  });
}
