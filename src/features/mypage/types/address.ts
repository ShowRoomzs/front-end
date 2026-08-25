/**
 * 배송지 (C13) — back-end `DeliveryAddressDto`.
 *
 * 서버 응답의 기본 배송지 키는 **`default`**이고(getter 이름이 그대로 JSON 키가 된다)
 * 요청 DTO는 **`isDefault`**를 받는다. 타입은 응답 형태(`default`)로 두고, 요청으로 나갈 때만
 * `addressService`가 키를 바꾼다 — 화면이 이 차이를 알 이유가 없다.
 *
 * 전화번호는 **하이픈이 있는 형태**여야 통과한다(`\d{2,3}-\d{3,4}-\d{4}`).
 * 화면은 숫자만 받고 저장 직전에 하이픈을 넣는다.
 */
export interface Address {
  id: number;
  recipientName: string;
  zipCode: string;
  /** 도로명(또는 지번) 주소 — 주소 검색 결과로만 채워진다 */
  address: string;
  detailAddress: string;
  phoneNumber: string;
  /** 배송 메모 — 최대 50자. 없으면 빈 문자열 또는 null */
  memo: string | null;
  default: boolean;
}

export type AddressRequest = Omit<Address, "id">;
