import {
  AUTH_ROUTES,
  CATEGORY_ROUTES,
  COMMON_ROUTES,
  HOME_ROUTES,
  ROOT_ROUTES,
} from "@/common/router/routes";
import { TermsType } from "@/features/auth/views/TermsView";

// 홈 하단 탭 파라미터
export type HomeTabParamList = {
  [HOME_ROUTES.CATEGORY]: undefined;
  [HOME_ROUTES.FOLLOWING]: undefined;
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.LIKE]: undefined;
  [HOME_ROUTES.MYPAGE]: undefined;
};

// 카테고리(탭 내부) 스택 파라미터
export type CategoryStackParamList = {
  [CATEGORY_ROUTES.HOME]: undefined;
  [CATEGORY_ROUTES.DETAIL]: {
    categoryId: number;
  };
};

// 인증 스택 파라미터
export type AuthStackParamList = {
  [AUTH_ROUTES.AUTH_HOME]: {
    onSuccessLogin?: () => void;
  };
  [AUTH_ROUTES.SIGN_UP]: {
    registerToken: string;
    onSuccessLogin?: () => void;
  };
  [AUTH_ROUTES.TERMS]: {
    termsType: TermsType;
  };
};

export type CommonStackParamList = {
  [COMMON_ROUTES.SEARCH]: undefined;
  [COMMON_ROUTES.CART]: undefined;
  [COMMON_ROUTES.NOTIFICATION]: undefined;
  [COMMON_ROUTES.SETTING]: undefined;
};

export type RootStackParamList = {
  [ROOT_ROUTES.HOME]: undefined;
  [ROOT_ROUTES.AUTH]: {
    params?: {
      onSuccessLogin?: () => void;
    };
  };
  [ROOT_ROUTES.COMMON]: {
    screen: keyof CommonStackParamList;
  };
};
