import { NavigatorScreenParams } from "@react-navigation/native";

import {
  AUTH_ROUTES,
  CATEGORY_ROUTES,
  COMMON_ROUTES,
  COUPON_ROUTES,
  HOME_ROUTES,
  MYPAGE_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from "@/common/router/routes";
import { TermsType } from "@/features/auth/views/TermsView";
import { WithdrawalReasonCode } from "@/features/setting/types/withdrawal";

// 홈 하단 탭 파라미터
export type HomeTabParamList = {
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.FOLLOWING]: undefined;
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
  [AUTH_ROUTES.IDENTITY_VERIFY]: {
    registerToken: string;
    onSuccessLogin?: () => void;
  };
  [AUTH_ROUTES.AGE_RESTRICTED]: undefined;
  [AUTH_ROUTES.VERIFY_FAILED]: {
    registerToken: string;
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
  [COMMON_ROUTES.CART]: undefined;
  [COMMON_ROUTES.NOTIFICATION]: undefined;
  [COMMON_ROUTES.SHOWROOM_DETAIL]: {
    showroomId: number;
  };
  [COMMON_ROUTES.POST_DETAIL]: {
    postId: number;
  };
  [COMMON_ROUTES.CATEGORY]: NavigatorScreenParams<CategoryStackParamList> | undefined;
  [COMMON_ROUTES.WISHLIST]: undefined;
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

export type CouponStackParamList = {
  [COUPON_ROUTES.LIST]: undefined;
  [COUPON_ROUTES.REGISTER]: undefined;
};

export type SettingsStackParamList = {
  [SETTINGS_ROUTES.MAIN]: undefined;
  [SETTINGS_ROUTES.NICKNAME_CHANGE]: undefined;
  [SETTINGS_ROUTES.MEMBER_INFO_CHANGE]: undefined;
  [SETTINGS_ROUTES.REFUND_ACCOUNT]: undefined;
  [SETTINGS_ROUTES.WITHDRAWAL]: undefined;
  [SETTINGS_ROUTES.WITHDRAWAL_CONFIRM]: {
    /** C15-3에서 고른 이유. 선택 사항이라 null일 수 있다 */
    reason: WithdrawalReasonCode | null;
    /** 이유가 ETC일 때 자유 입력 */
    customReason: string | null;
  };
};

export type MypageStackParamList = {
  [MYPAGE_ROUTES.MAIN]: undefined;
  [MYPAGE_ROUTES.SETTINGS]: undefined;
  [MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH]: undefined;
  [MYPAGE_ROUTES.CANCEL_AND_REFUND]: undefined;
  [MYPAGE_ROUTES.ADDRESS_MANAGEMENT]: undefined;
  [MYPAGE_ROUTES.ADDRESS_FORM]?: {
    addressId?: number;
  };
  [MYPAGE_ROUTES.INQUIRY_HISTORY]: undefined;
  [MYPAGE_ROUTES.INQUIRY_REGISTER]?: {
    inquiryId?: number;
  };
  [MYPAGE_ROUTES.NOTICE]: undefined;
  [MYPAGE_ROUTES.CUSTOMER_CENTER]: undefined;
  [MYPAGE_ROUTES.OPEN_LICENSE]: undefined;
  [MYPAGE_ROUTES.PRIVACY_POLICY]: undefined;
  [MYPAGE_ROUTES.SERVICE_AGREEMENT]: undefined;
  [MYPAGE_ROUTES.COUPON]: NavigatorScreenParams<CouponStackParamList> | undefined;
};
