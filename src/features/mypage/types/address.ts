export interface Address {
  id: number;
  recipientName: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  default: boolean;
}

export type AddressRequest = Omit<Address, "id">;
