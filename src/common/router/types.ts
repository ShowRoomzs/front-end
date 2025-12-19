import { AUTH_ROUTES, HOME_ROUTES } from "./routes";

// 홈 하단 탭 파라미터
export type HomeTabParamList = {
  [HOME_ROUTES.CATEGORY]: undefined;
  [HOME_ROUTES.FEED]: undefined;
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.WISH_LIST]: undefined;
  [HOME_ROUTES.PROFILE]: undefined;
};

// 인증 스택 파라미터
export type AuthStackParamList = {
  [AUTH_ROUTES.HOME]: undefined;
  [AUTH_ROUTES.SIGN_UP]: undefined;
};
