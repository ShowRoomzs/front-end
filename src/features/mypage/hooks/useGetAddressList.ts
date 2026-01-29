import { useQuery } from "@tanstack/react-query";

import { MYPAGE_QUERY_KEY } from "@/features/mypage/constants/querykey";
import { addressService } from "@/features/mypage/services/addressService";

export function useGetAddressList() {
  return useQuery({
    queryKey: [MYPAGE_QUERY_KEY.ADDRESS_LIST],
    queryFn: addressService.getAddresses,
  });
}
