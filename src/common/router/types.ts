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
import { Address } from "@/features/mypage/types/address";
import { ClaimType, DeliveryCarrierCode } from "@/features/order/types/claim";
import { DirectItem } from "@/features/order/types/order";
import { WithdrawalReasonCode } from "@/features/setting/types/withdrawal";
import { TermsType as TermsDocumentType } from "@/features/terms/types/terms";

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
    /** 헤더의 돋보기처럼 빈 필드로 열 때는 빈 문자열을 넘긴다 */
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
    /** 진입한 공구 — 알면 넘긴다. 없으면 서버가 이 상품을 담은 판매 중 공구가 하나일 때만 정해 준다 */
    groupBuyId?: number;
  };
  [COMMON_ROUTES.PRODUCT_INQUIRY]: {
    productId: number;
    inquiryId?: number;
  };
  /** C7-2 문의 전체 — 답변 블록에 판매자 이름을 적어야 해 상세가 가지고 있는 값을 넘긴다 */
  [COMMON_ROUTES.PRODUCT_INQUIRY_LIST]: {
    productId: number;
    sellerName: string;
  };
  /** C4 쇼룸 하단 고지에서 여는 약관 — 마이 탭을 거치지 않고 이 스택에서 바로 연다 */
  [COMMON_ROUTES.TERMS_DOCUMENT]: {
    termsType: TermsDocumentType;
  };
  /** 장바구니 진입이면 `cartItemIds`, 바로 구매면 `direct` — 둘 중 하나만 */
  [COMMON_ROUTES.CHECKOUT]: {
    cartItemIds?: Array<number>;
    direct?: DirectItem;
  };
  [COMMON_ROUTES.ORDER_DETAIL]: {
    orderId: number;
  };
  [COMMON_ROUTES.ORDER_CANCEL]: {
    orderId: number;
  };
  /** 진입한 항목이 미리 체크된다 */
  [COMMON_ROUTES.CANCEL_REQUEST]: {
    orderId: number;
    orderProductId?: number;
  };
  [COMMON_ROUTES.CANCEL_DETAIL]: {
    cancelRequestId: number;
  };
  /** 주문 항목의 송장이면 `orderId`+`orderProductId`, 재발송 송장이면 `reshipClaimId` */
  [COMMON_ROUTES.DELIVERY_TRACKING]: {
    orderId?: number;
    orderProductId?: number;
    reshipClaimId?: number;
  };
  [COMMON_ROUTES.CLAIM_REQUEST]: {
    orderProductId: number;
    type: ClaimType;
  };
  [COMMON_ROUTES.CLAIM_DETAIL]: {
    claimId: number;
  };
  /** [송장 수정]이면 등록된 값을 채운 채 연다 */
  [COMMON_ROUTES.CLAIM_INVOICE]: {
    claimId: number;
    carrier?: DeliveryCarrierCode;
    trackingNumber?: string;
  };
  [COMMON_ROUTES.COLLECTION_TRACKING]: {
    claimId: number;
  };
  /**
   * C13-2 배송지 선택.
   *
   * 주문·교환은 배송지 id가 아니라 **값의 사본**을 든다 — 그래서 "지금 쓰는 주소"를 id로 넘길 수 없는
   * 자리(주문 상세 · 교환 상세)는 `matchAddress`로 넘기고 화면이 목록과 값으로 비교한다.
   * `onSelect`가 true를 돌려주면(또는 끝나면) 이전 화면으로 돌아간다.
   */
  [COMMON_ROUTES.ADDRESS_SELECT]: {
    selectedAddressId?: number;
    matchAddress?: Pick<Address, "recipientName" | "zipCode" | "address">;
    onSelect: (address: Address) => Promise<boolean | void> | boolean | void;
  };
  [COMMON_ROUTES.ADDRESS_FORM]?: {
    addressId?: number;
    /** 새로 만든 배송지를 바로 고르게 할 때 — 저장 후 그 id를 넘긴다 */
    onSaved?: (addressId: number | null) => void;
  };
  [COMMON_ROUTES.INQUIRY_REGISTER]: {
    orderId: number;
    orderNumber: string;
  };
};

export type RootStackParamList = {
  [ROOT_ROUTES.HOME]: undefined;
  [ROOT_ROUTES.AUTH]: {
    params?: {
      onSuccessLogin?: () => void;
    };
  };
  // 딥링크 설정이 이 스택을 중첩으로 읽어야 하므로 네비게이션이 이해하는 형태로 둔다 —
  // 직접 {screen, params}로 적으면 화면별 파라미터 검사도 함께 사라진다
  [ROOT_ROUTES.COMMON]: NavigatorScreenParams<CommonStackParamList>;
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
  [MYPAGE_ROUTES.INQUIRY_DETAIL]: {
    inquiryId: number;
  };
  [MYPAGE_ROUTES.INQUIRY_REGISTER]?: {
    inquiryId?: number;
    /** 주문 상세에서 열면 그 주문이 연결된 채로 시작한다 */
    orderId?: number;
    orderNumber?: string;
  };
  [MYPAGE_ROUTES.NOTICE]: undefined;
  [MYPAGE_ROUTES.CUSTOMER_CENTER]: undefined;
  [MYPAGE_ROUTES.OPEN_LICENSE]: undefined;
  [MYPAGE_ROUTES.PRIVACY_POLICY]: undefined;
  [MYPAGE_ROUTES.SERVICE_AGREEMENT]: undefined;
  [MYPAGE_ROUTES.COUPON]: NavigatorScreenParams<CouponStackParamList> | undefined;
};
