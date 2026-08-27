/**
 * 하단 탭 — 디자인 확정안의 4탭이다(홈 · 팔로잉 · 좋아요 · 마이).
 *
 * 카테고리 탐색은 C14 쇼룸 검색 안으로, 상품 위시리스트는 마이 > 쇼핑 정보로 옮겼다.
 * 좋아요(LIKE)는 상품이 아니라 게시물을 모아 보는 화면이다 — 서버 경로가 wishlist인 것은
 * 앱이 쓰던 옛 계약을 그대로 둔 것뿐이다.
 */
export const HOME_ROUTES = {
  HOME: "home",
  FOLLOWING: "following",
  LIKE: "like",
  MYPAGE: "mypage",
} as const;

// 카테고리 스택 네비게이션 (카테고리 탭 내부에서만 사용)
export const CATEGORY_ROUTES = {
  HOME: "categoryHome",
  DETAIL: "categoryDetail",
} as const;

// 인증 스택 네비게이션
/**
 * 가입 흐름은 C0 로그인 → C0-2 본인인증 → C0-1 회원가입 순서다.
 * 본인인증 결과에 따라 만 14세 미만 차단(AGE_RESTRICTED) 또는 실패(VERIFY_FAILED)로 갈린다.
 */
export const AUTH_ROUTES = {
  AUTH_HOME: "authHome",
  IDENTITY_VERIFY: "identityVerify",
  AGE_RESTRICTED: "ageRestricted",
  VERIFY_FAILED: "verifyFailed",
  SIGN_UP: "signUp",
  TERMS: "terms",
} as const;

// 공통 스택 네베게이션
export const COMMON_ROUTES = {
  SEARCH: "search",
  CART: "cart",
  NOTIFICATION: "notification",
  PRODUCT_DETAIL: "productDetail",
  PRODUCT_INQUIRY: "productInquiry",
  SHOWROOM_DETAIL: "showroomDetail",
  POST_DETAIL: "postDetail",
  CATEGORY: "commonCategory",
  WISHLIST: "commonWishlist",
  TERMS_DOCUMENT: "commonTermsDocument",
} as const;

// 설정 스택 네비게이션
export const SETTINGS_ROUTES = {
  MAIN: "settingsMain",
  NICKNAME_CHANGE: "nicknameChange",
  MEMBER_INFO_CHANGE: "memberInfoChange",
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
  INQUIRY_HISTORY: "inquiryHistory",
  INQUIRY_DETAIL: "inquiryDetail",
  INQUIRY_REGISTER: "inquiryRegister",
  CUSTOMER_CENTER: "customerCenter",
  NOTICE: "notice",
  OPEN_LICENSE: "openLicense",
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
