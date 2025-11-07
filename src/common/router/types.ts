import { AUTH_ROUTES, HOME_ROUTES, MAIN_ROUTES } from "./routes";

// 메인 라우터 파라미터 (최상위 네비게이터)
export type MainStackParamList = {
  [MAIN_ROUTES.AUTH]: undefined;
  [MAIN_ROUTES.MAIN]: undefined;
};

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

// 전체 라우트 파라미터 (타입 헬퍼용)
export type RootParamList = MainStackParamList & HomeTabParamList & AuthStackParamList;
