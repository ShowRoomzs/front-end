import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageSectionProps } from "@/features/mypage/components/MypageSection/MypageSection";

export const MYPAGE_MENUS: Array<MypageSectionProps> = [
  {
    title: "나의 쇼핑 정보",
    items: [
      {
        title: "주문 및 배송 조회",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH,
        hasPermission: true,
      },
      {
        title: "취소 및 환불",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.CANCEL_AND_REFUND,
        hasPermission: true,
      },
      {
        title: "배송지 관리",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.ADDRESS_MANAGEMENT,
        hasPermission: true,
      },
    ],
  },
  {
    title: "고객 문의 및 공지",
    items: [
      {
        title: "문의 내역",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.INQUIRY_HISTORY,
        hasPermission: true,
      },
      {
        title: "고객센터",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.CUSTOMER_CENTER,
      },
      {
        title: "공지사항",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.NOTICE,
      },
    ],
  },
  {
    title: "약관 및 라이선스",
    items: [
      {
        title: "오픈라이선스",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.OPEN_LICENSE,
      },
      {
        title: "버전 정보",
        rightType: "version",
        appVersion: "1.0.0", // TODO : 버전 가져오기
      },
      {
        title: "개인정보 처리 방침",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.PRIVACY_POLICY,
      },
      {
        title: "서비스 이용 약관",
        rightType: "arrow",
        routeName: MYPAGE_ROUTES.SERVICE_AGREEMENT,
      },
    ],
  },
];
