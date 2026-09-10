import { BankResponse } from "@/common/types/bank";
import { PageParams } from "@/common/types/page";
import { demoDelay } from "@/demo/config";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import { Coupon, ProductByCouponResponse } from "@/features/coupon/types/coupon";
import { Filter } from "@/features/filter/types/filter";
import { AccountInfo, NotificationSettings } from "@/features/setting/types/notification";
import { RefundAccountResponse } from "@/features/setting/types/refundAccount";
import { WithdrawalInfo } from "@/features/setting/types/withdrawal";

/**
 * 설정 · 쿠폰 · 은행 · 필터 — 시연에서 깊이 들어가진 않지만 **탭하면 열리는** 화면들이다.
 *
 * 마이 헤더의 설정 아이콘은 누구나 한 번은 눌러 보므로, 알림 설정이 로딩 실패로 비어 있으면
 * 그 자리에서 데모가 멈춘 것처럼 보인다. 값이 그럴듯하기만 하면 되는 자리라 최소한만 채운다.
 */

let notificationSettings: NotificationSettings = {
  followPostPushAgree: true,
  marketingAgree: true,
  marketingAgreeChangedAt: new Date("2026-08-02T14:30:00").toISOString(),
};

let refundAccount: RefundAccountResponse = {
  bankCode: "004",
  bankName: "KB국민은행",
  accountNumber: "12345604789012",
  accountHolder: "이수민",
};

export const demoSettingService = {
  getNotificationSettings: () => demoDelay(notificationSettings),

  updateNotificationSettings: async (data: Partial<NotificationSettings>) => {
    notificationSettings = {
      ...notificationSettings,
      ...data,
      marketingAgreeChangedAt:
        data.marketingAgree === undefined
          ? notificationSettings.marketingAgreeChangedAt
          : new Date().toISOString(),
    };
    return notificationSettings;
  },

  getAccountInfo: (): Promise<AccountInfo> =>
    demoDelay({
      name: "이수*",
      birthday: "1996.04.**",
      phoneNumber: "010-****-7736",
      identityVerifiedAt: new Date("2026-03-14T09:12:00").toISOString(),
    }),

  reverifyIdentity: async (): Promise<AccountInfo> => ({
    name: "이수*",
    birthday: "1996.04.**",
    phoneNumber: "010-****-7736",
    identityVerifiedAt: new Date().toISOString(),
  }),

  getRefundAccount: () => demoDelay(refundAccount),

  updateRefundAccount: async (data: Omit<RefundAccountResponse, "bankName">) => {
    refundAccount = { ...refundAccount, ...data };
    return undefined;
  },

  getWithdrawalInfo: (): Promise<WithdrawalInfo> =>
    demoDelay({
      withdrawable: true,
      ongoingOrderCount: 0,
      followingCount: demoStore.followedShowroomIds().length,
      wishlistCount: demoStore.likedPostIds().length,
      cartCount: demoStore.cart().length,
      reasons: [
        { code: "NO_GROUP_BUY", label: "관심 있는 공동구매가 없어요" },
        { code: "TOO_MANY_NOTIFICATIONS", label: "알림이 너무 많이 와요" },
        { code: "INCONVENIENT_APP", label: "앱 사용이 불편해요" },
        { code: "PRIVACY_CONCERN", label: "개인정보가 걱정돼요" },
        { code: "REJOIN_OTHER_ACCOUNT", label: "다른 계정으로 다시 가입할래요" },
        { code: "ETC", label: "기타" },
      ],
    }),

  withdrawal: async () => undefined,
};

export const demoBankService = {
  get: (): Promise<BankResponse> =>
    demoDelay([
      { code: "004", name: "KB국민은행" },
      { code: "088", name: "신한은행" },
      { code: "020", name: "우리은행" },
      { code: "081", name: "하나은행" },
      { code: "011", name: "NH농협은행" },
      { code: "090", name: "카카오뱅크" },
      { code: "092", name: "토스뱅크" },
    ]),
};

const COUPONS: Array<Coupon> = [
  {
    couponId: 3001,
    userCouponId: 4001,
    couponCode: "WELCOME3000",
    name: "첫 공동구매 3,000원 할인",
    discountType: "FIXED_AMOUNT",
    discountValue: 3000,
    maxDiscountAmount: null,
    minOrderAmount: 20000,
    registeredAt: new Date("2026-08-20T10:00:00").toISOString(),
    validStartAt: new Date("2026-08-20T00:00:00").toISOString(),
    validEndAt: new Date("2026-10-31T23:59:59").toISOString(),
  },
  {
    couponId: 3002,
    userCouponId: 4002,
    couponCode: "AUTUMN10",
    name: "가을맞이 10% 할인",
    discountType: "PERCENTAGE",
    discountValue: 10,
    maxDiscountAmount: 5000,
    minOrderAmount: 30000,
    registeredAt: new Date("2026-09-01T10:00:00").toISOString(),
    validStartAt: new Date("2026-09-01T00:00:00").toISOString(),
    validEndAt: new Date("2026-09-30T23:59:59").toISOString(),
  },
  {
    couponId: 3003,
    userCouponId: 4003,
    couponCode: "FREESHIP",
    name: "배송비 무료 쿠폰",
    discountType: "FIXED_AMOUNT",
    discountValue: 3000,
    maxDiscountAmount: null,
    minOrderAmount: null,
    registeredAt: new Date("2026-09-05T10:00:00").toISOString(),
    validStartAt: new Date("2026-09-05T00:00:00").toISOString(),
    validEndAt: new Date("2026-12-31T23:59:59").toISOString(),
  },
];

export const demoCouponService = {
  getAll: (params: PageParams) => demoDelay(demoPage(COUPONS, params)),
  create: async () => undefined,
  getByProductId: (): Promise<ProductByCouponResponse> =>
    demoDelay([
      {
        couponId: 3002,
        name: "가을맞이 10% 할인",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minimumOrderPrice: 30000,
        validUntil: new Date("2026-09-30T23:59:59").toISOString(),
        isDownloaded: false,
      },
    ]),
};

const FILTERS: Array<Filter> = [
  {
    id: 1,
    filterKey: "skinType",
    label: "피부 타입",
    filterType: "SELECT",
    condition: "OR",
    sortOrder: 1,
    isActive: true,
    values: [
      { id: 11, value: "DRY", label: "건성", extra: null, sortOrder: 1, isActive: true },
      { id: 12, value: "OILY", label: "지성", extra: null, sortOrder: 2, isActive: true },
      { id: 13, value: "SENSITIVE", label: "민감성", extra: null, sortOrder: 3, isActive: true },
      { id: 14, value: "COMBINATION", label: "복합성", extra: null, sortOrder: 4, isActive: true },
    ],
  },
  {
    id: 2,
    filterKey: "priceRange",
    label: "가격대",
    filterType: "RADIO",
    condition: "OR",
    sortOrder: 2,
    isActive: true,
    values: [
      { id: 21, value: "UNDER_20000", label: "2만원 이하", extra: null, sortOrder: 1, isActive: true },
      { id: 22, value: "20000_40000", label: "2~4만원", extra: null, sortOrder: 2, isActive: true },
      { id: 23, value: "OVER_40000", label: "4만원 이상", extra: null, sortOrder: 3, isActive: true },
    ],
  },
];

export const demoFilterService = {
  get: () => demoDelay(FILTERS),
};
