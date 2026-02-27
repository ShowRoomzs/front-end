export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
export interface Coupon {
  couponCode: string;
  couponId: number;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number | null;
  name: string;
  registeredAt: string;
  userCouponId: number;
  validEndAt: string;
  validStartAt: string;
}

export interface CreateCouponRequest {
  code: string;
}
