// 하단 탭 네비게이션
export const HOME_ROUTES = {
  CATEGORY: "category",
  FOLLOWING: "following",
  HOME: "home",
  WISHLIST: "wishlist",
  MYPAGE: "mypage",
} as const;

// 카테고리 스택 네비게이션 (카테고리 탭 내부에서만 사용)
export const CATEGORY_ROUTES = {
  HOME: "categoryHome",
  DETAIL: "categoryDetail",
} as const;

// 인증 스택 네비게이션
export const AUTH_ROUTES = {
  AUTH_HOME: "authHome",
  SIGN_UP: "signUp",
  TERMS: "terms",
} as const;

// 공통 스택 네베게이션
export const COMMON_ROUTES = {
  SEARCH: "search",
  SEARCH_DETAIL: "searchDetail",
  CART: "cart",
  NOTIFICATION: "notification",
  SETTING: "setting",
  PRODUCT_DETAIL: "productDetail",
  PRODUCT_INQUIRY: "productInquiry",
  MARKET_DETAIL: "marketDetail",
} as const;

// 설정 스택 네비게이션
export const SETTINGS_ROUTES = {
  MAIN: "settingsMain",
  NICKNAME_CHANGE: "nicknameChange",
  MEMBER_INFO_CHANGE: "memberInfoChange",
  NOTIFICATION_SETTINGS: "notificationSettings",
  REFUND_ACCOUNT: "refundAccount",
  WITHDRAWAL: "withdrawal",
  WITHDRAWAL_CONFIRM: "withdrawalConfirm",
} as const;

// 마이페이지 스택 네비게이션
export const MYPAGE_ROUTES = {
  MAIN: "main",
  SETTINGS: "settings",
  ORDER_AND_DELIVERY_SEARCH: "orderAndDeliverySearch",
  CANCEL_AND_REFUND: "cancelAndRefund",
  ADDRESS_MANAGEMENT: "addressManagement",
  ADDRESS_FORM: "addressForm",
  FOLLOWING_LIST: "followingList",
  INQUIRY_HISTORY: "inquiryHistory",
  INQUIRY_REGISTER: "inquiryRegister",
  CUSTOMER_CENTER: "customerCenter",
  NOTICE: "notice",
  NOTICE_DETAIL: "noticeDetail",
  OPEN_LICENSE: "openLicense",
  VERSION_INFO: "versionInfo",
  PRIVACY_POLICY: "privacyPolicy",
  SERVICE_AGREEMENT: "serviceAgreement",
  COUPON: "coupon",
} as const;

// 쿠폰 스택 네비게이션
export const COUPON_ROUTES = {
  LIST: "couponList",
  REGISTER: "couponRegister",
} as const;

export const ROOT_ROUTES = {
  HOME: "home",
  AUTH: "auth",
  COMMON: "common",
} as const;

export const ROUTES = {
  ...HOME_ROUTES,
  ...CATEGORY_ROUTES,
  ...AUTH_ROUTES,
  ...ROOT_ROUTES,
} as const;

export type HomeRouteName = (typeof HOME_ROUTES)[keyof typeof HOME_ROUTES];
export type CategoryRouteName = (typeof CATEGORY_ROUTES)[keyof typeof CATEGORY_ROUTES];
export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type SettingsRouteName = (typeof SETTINGS_ROUTES)[keyof typeof SETTINGS_ROUTES];
export type MyPageRouteName = (typeof MYPAGE_ROUTES)[keyof typeof MYPAGE_ROUTES];
export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
