// 하단 탭 네비게이션
export const HOME_ROUTES = {
  CATEGORY: "category",
  FEED: "feed",
  WISH_LIST: "wishList",
  HOME: "home",
  PROFILE: "profile",
} as const;

// 인증 관련
export const AUTH_ROUTES = {
  HOME: "home",
  SIGN_UP: "signUp",
} as const;

// 메인 라우터 (최상위)
export const MAIN_ROUTES = {
  AUTH: "auth",
  MAIN: "main",
} as const;

export const ROUTES = {
  ...MAIN_ROUTES,
  ...HOME_ROUTES,
  ...AUTH_ROUTES,
} as const;

export type HomeRouteName = (typeof HOME_ROUTES)[keyof typeof HOME_ROUTES];
export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type MainRouteName = (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];
export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
