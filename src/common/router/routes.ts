// 하단 탭 네비게이션
export const HOME_ROUTES = {
  CATEGORY: "category",
  FOLLOWING: "following",
  HOME: "home",
  LIKE: "like",
  MYPAGE: "mypage",
} as const;

// 인증 관련
export const AUTH_ROUTES = {
  HOME: "home",
  SIGN_UP: "signUp",
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
export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
