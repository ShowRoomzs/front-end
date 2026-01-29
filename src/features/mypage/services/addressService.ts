import { apiInstance } from "@/common/lib/apiInstance";
import { Address, AddressRequest } from "@/features/mypage/types/address";

export const addressService = {
  getAddresses: async () => {
    const { data: response } = await apiInstance.get<Array<Address>>("/user/delivery-addresses");

    return response;
  },
  addAddress: async (address: AddressRequest) => {
    const { data: response } = await apiInstance.post<Address>("/user/delivery-addresses", address);

    return response;
  },
  updateAddress: async (addressId: number, address: AddressRequest) => {
    const { data: response } = await apiInstance.put<Address>(
      `/user/delivery-addresses/${addressId}`,
      address
    );

    return response;
  },
  removeAddress: async (addressId: number) => {
    const { data: response } = await apiInstance.delete<void>(`/user/delivery-addresses/${addressId}`);

    return response;
  },
  setDefaultAddress: async (addressId: number) => {
    const { data: response } = await apiInstance.patch<void>(`/user/delivery-addresses/${addressId}/default`);

    return response;
  },
};
