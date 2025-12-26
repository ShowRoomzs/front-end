import { AUTH_ROUTES, HOME_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { TermsType } from "@/features/auth/views/TermsView";

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
  [AUTH_ROUTES.AUTH_HOME]: {
    onSuccessLogin?: () => void;
  };
  [AUTH_ROUTES.SIGN_UP]: {
    onSuccessLogin?: () => void;
  };
  [AUTH_ROUTES.TERMS]: {
    termsType: TermsType;
  };
};

export type RootStackParamList = {
  [ROOT_ROUTES.HOME]: undefined;
  [ROOT_ROUTES.AUTH]: {
    params?: {
      onSuccessLogin?: () => void;
    };
  };
};
