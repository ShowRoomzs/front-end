export interface Address {
  id: number;
  recipientName: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  isDefault: boolean;
}

export type AddressRequest = Omit<Address, "id">;
