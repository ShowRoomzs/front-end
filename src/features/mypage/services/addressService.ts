import { apiInstance } from "@/common/lib/apiInstance";
import { Address, AddressRequest } from "@/features/mypage/types/address";

/**
 * 배송지 API — **요청과 응답의 기본 배송지 키가 다르다.**
 *
 * 응답은 `default`(Lombok의 `isDefault()` getter에서 파생된 이름), 요청 DTO는
 * `@JsonProperty("isDefault")`가 붙어 `isDefault`를 받는다. `default`로 보내면 Jackson이
 * 모르는 필드로 흘려버려 **체크가 조용히 무시된다**(등록·수정 시 항상 기본이 아님).
 *
 * 화면이 이 차이를 알 필요는 없으므로 여기서 한 번만 맞춘다.
 */
function toRequestBody(address: AddressRequest) {
  const { default: isDefault, ...rest } = address;

  return { ...rest, isDefault };
}

export const addressService = {
  get: async () => {
    const { data: response } = await apiInstance.get<Array<Address>>("/user/delivery-addresses");

    return response;
  },
  getDetail: async (addressId: number) => {
    const { data: response } = await apiInstance.get<Address>(`/user/delivery-addresses/${addressId}`);

    return response;
  },
  create: async (address: AddressRequest) => {
    const { data: response } = await apiInstance.post<Address>(
      "/user/delivery-addresses",
      toRequestBody(address)
    );

    return response;
  },
  update: async (addressId: number, address: AddressRequest) => {
    const { data: response } = await apiInstance.put<Address>(
      `/user/delivery-addresses/${addressId}`,
      toRequestBody(address)
    );

    return response;
  },
  delete: async (addressId: number) => {
    const { data: response } = await apiInstance.delete<void>(`/user/delivery-addresses/${addressId}`);

    return response;
  },
  setDefault: async (addressId: number) => {
    const { data: response } = await apiInstance.patch<void>(`/user/delivery-addresses/${addressId}/default`);

    return response;
  },
};
