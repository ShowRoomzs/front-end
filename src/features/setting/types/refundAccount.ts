export interface RefundAccountResponse {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export type UpdateRefundAccountRequest = Omit<RefundAccountResponse, "bankName">;
