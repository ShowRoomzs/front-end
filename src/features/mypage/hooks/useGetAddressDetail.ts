import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { MYPAGE_QUERY_KEY } from "@/features/mypage/constants/queryKey";
import { addressService } from "@/features/mypage/services/addressService";

export function useGetAddressDetail(addressId?: number) {
  const queryFn = useCallback(async () => {
    const res = await addressService.getDetail(addressId ?? 0);

    return {
      ...res,
      phoneNumber: res.phoneNumber.replaceAll("-", ""),
    };
  }, [addressId]);

  return useQuery({
    queryKey: [MYPAGE_QUERY_KEY.ADDRESS_DETAIL, addressId],
    queryFn,
    enabled: !!addressId,
  });
}
