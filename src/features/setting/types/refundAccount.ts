export interface RefundAccountResponse {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export type UpdateRefundAccountRequest = Omit<RefundAccountResponse, "bankName">;

export interface WithdrawalRequest {
  agreeConsent: boolean;
  reason: string;
  customReason: string | null;
}
