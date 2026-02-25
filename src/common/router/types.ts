import {
  AUTH_ROUTES,
  CATEGORY_ROUTES,
  COMMON_ROUTES,
  HOME_ROUTES,
  MYPAGE_ROUTES,
  ROOT_ROUTES,
} from "@/common/router/routes";
import { TermsType } from "@/features/auth/views/TermsView";

// 홈 하단 탭 파라미터
export type HomeTabParamList = {
  [HOME_ROUTES.CATEGORY]: undefined;
  [HOME_ROUTES.FOLLOWING]: undefined;
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.WISHLIST]: undefined;
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
  [COMMON_ROUTES.SEARCH]: {
    keyword: string;
  };
  [COMMON_ROUTES.SEARCH_DETAIL]: {
    keyword: string;
  };
  [COMMON_ROUTES.CART]: undefined;
  [COMMON_ROUTES.NOTIFICATION]: undefined;
  [COMMON_ROUTES.SETTING]: undefined;
  [COMMON_ROUTES.MARKET_DETAIL]: {
    marketId: number;
  };
  [COMMON_ROUTES.PRODUCT_DETAIL]: {
    productId: number;
  };
  [COMMON_ROUTES.PRODUCT_INQUIRY]: {
    productId: number;
    inquiryId?: number;
  };
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
    params?: CommonStackParamList[keyof CommonStackParamList];
  };
};

export type MypageStackParamList = {
  [MYPAGE_ROUTES.MAIN]: undefined;
  [MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH]: undefined;
  [MYPAGE_ROUTES.CANCEL_AND_REFUND]: undefined;
  [MYPAGE_ROUTES.ADDRESS_MANAGEMENT]: undefined;
  [MYPAGE_ROUTES.ADDRESS_FORM]?: {
    addressId?: number;
  };
  [MYPAGE_ROUTES.FOLLOWING_LIST]: undefined;
  [MYPAGE_ROUTES.INQUIRY_HISTORY]: undefined;
  [MYPAGE_ROUTES.INQUIRY_REGISTER]: {
    inquiryId?: number;
  };
  [MYPAGE_ROUTES.CUSTOMER_CENTER]: undefined;
  [MYPAGE_ROUTES.NOTICE]: undefined;
  [MYPAGE_ROUTES.OPEN_LICENSE]: undefined;
  [MYPAGE_ROUTES.VERSION_INFO]: undefined;
  [MYPAGE_ROUTES.PRIVACY_POLICY]: undefined;
  [MYPAGE_ROUTES.SERVICE_AGREEMENT]: undefined;
};
