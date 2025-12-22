import { AUTH_ROUTES, HOME_ROUTES, ROOT_ROUTES } from "./routes";

// 홈 하단 탭 파라미터
export type HomeTabParamList = {
  [HOME_ROUTES.CATEGORY]: undefined;
  [HOME_ROUTES.FOLLOWING]: undefined;
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.LIKE]: undefined;
  [HOME_ROUTES.MYPAGE]: undefined;
};

// 인증 스택 파라미터
export type AuthStackParamList = {
  [AUTH_ROUTES.HOME]: undefined;
  [AUTH_ROUTES.SIGN_UP]: undefined;
};

export type RootStackParamList = {
  [ROOT_ROUTES.HOME]: undefined;
  [ROOT_ROUTES.AUTH]: undefined;
};
