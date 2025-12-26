// 하단 탭 네비게이션
export const HOME_ROUTES = {
  CATEGORY: "category",
  FOLLOWING: "following",
  HOME: "home",
  LIKE: "like",
  MYPAGE: "mypage",
} as const;

// 인증 스택 네비게이션
export const AUTH_ROUTES = {
  AUTH_HOME: "authHome",
  SIGN_UP: "signUp",
  TERMS: "terms",
} as const;

export const MYPAGE_ROUTES = {
  ORDER_AND_DELIVERY_SEARCH: "orderAndDeliverySearch",
  CANCEL_AND_REFUND: "cancelAndRefund",
  ADDRESS_MANAGEMENT: "addressManagement",
  INQUIRY_HISTORY: "inquiryHistory",
  CUSTOMER_CENTER: "customerCenter",
  NOTICE: "notice",
} as const;

export const ROOT_ROUTES = {
  HOME: "home",
  AUTH: "auth",
} as const;

export const ROUTES = {
  ...HOME_ROUTES,
  ...AUTH_ROUTES,
  ...ROOT_ROUTES,
} as const;

export type HomeRouteName = (typeof HOME_ROUTES)[keyof typeof HOME_ROUTES];
export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type MyPageRouteName = (typeof MYPAGE_ROUTES)[keyof typeof MYPAGE_ROUTES];
export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
