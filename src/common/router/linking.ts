import { getStateFromPath, LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import {
  AUTH_ROUTES,
  COMMON_ROUTES,
  COUPON_ROUTES,
  HOME_ROUTES,
  MYPAGE_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from "@/common/router/routes";
import { RootStackParamList } from "@/common/router/types";

/**
 * 주소에 싣지 않을 파라미터 — 콜백 함수(`onSuccessLogin`)는 주소로 옮길 수 없고, 가입 토큰은 주소창 · 방문 기록에
 * 남으면 안 된다. stringify가 undefined를 돌려주면 주소의 쿼리에서 빠진다(타입은 문자열만 받아 맞춰 둔다)
 */
const omitFromUrl = (() => undefined) as unknown as (value: unknown) => string;

/** 가입 중간 화면 — 가입 토큰을 주소에 싣지 않으므로 새로고침하면 이어 갈 수 없다. 로그인 첫 화면으로 돌린다 */
const SIGNUP_STEP_PATH = /^\/?login\/(verify|verify-failed|signup)(\/|\?|$)/;

/**
 * 딥링크 — 앱 바깥에서 쇼룸·게시물·상품으로 바로 착지시킨다. 웹에서는 주소창 주소이기도 하다.
 *
 * **C4 쇼룸은 SNS 프로필 링크로 들어오는 것이 기본 동선이다.** 이 설정이 없으면 링크를 눌러도
 * 앱만 열리고 홈에 떨어져, 크리에이터가 올린 링크가 아무 데로도 가지 않는다.
 * 게시물 ⋯의 [링크 복사]가 만드는 주소도 여기서 받는다.
 *
 * 여기 없는 화면은 웹에서 화면 이름이 주소가 되고, 새로고침하면 그 주소를 읽지 못해 홈으로 간다.
 * 그래서 번호 하나 · 파라미터 없이 다시 그릴 수 있는 화면은 모두 주소를 준다. 앞 화면이 넘긴 객체 · 함수가 있어야
 * 하는 화면(결제 · 배송지 선택 · 취소 요청 등)은 넣지 않는다 — 새로고침하면 홈으로 가는 편이 깨진 화면보다 낫다.
 *
 * `initialRouteName`은 주소로 바로 들어왔을 때 그 아래 깔 화면이다. 없으면 스택에 그 화면 하나뿐이라
 * **뒤로 가기가 아무 데로도 가지 않는다**(SNS 링크로 쇼룸에 들어온 사람이 나갈 길이 없다).
 *
 * `Linking.createURL("")`을 접두사에 함께 넣는 이유는 **Expo Go와 개발 빌드의 주소가 다르기**
 * 때문이다(`exp://…` / `showroomz://`). 배포 빌드에서는 앱 스킴만 쓰인다.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL(""), "showroomz://"],
  getStateFromPath(path, options) {
    return getStateFromPath(SIGNUP_STEP_PATH.test(path) ? "/login" : path, options);
  },
  config: {
    initialRouteName: ROOT_ROUTES.HOME,
    screens: {
      /*
        하단 탭의 주소 — 정하지 않으면 화면 이름이 그대로 경로가 돼 웹 주소창에 /home/home ·
        /home/mypage/main이 보인다. 홈은 사이트 첫 주소(/)다. 마이 안쪽 화면은 /my/… 아래에 붙는다
      */
      [ROOT_ROUTES.HOME]: {
        path: "",
        screens: {
          [HOME_ROUTES.HOME]: "",
          [HOME_ROUTES.FOLLOWING]: "following",
          [HOME_ROUTES.LIKE]: "likes",
          [HOME_ROUTES.MYPAGE]: {
            path: "my",
            // 마이 스택 파라미터 타입(선택 키 섞인 목록)에서 라이브러리 타입 추론이 키를 못 읽는다 — 값은 맞다
            initialRouteName: MYPAGE_ROUTES.MAIN as never,
            screens: {
              [MYPAGE_ROUTES.MAIN]: "",
              [MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH]: "orders",
              [MYPAGE_ROUTES.ADDRESS_MANAGEMENT]: "addresses",
              [MYPAGE_ROUTES.INQUIRY_HISTORY]: "inquiries",
              [MYPAGE_ROUTES.INQUIRY_DETAIL]: {
                path: "inquiries/:inquiryId",
                parse: { inquiryId: Number },
              },
              [MYPAGE_ROUTES.CUSTOMER_CENTER]: "support",
              [MYPAGE_ROUTES.NOTICE]: "notices",
              [MYPAGE_ROUTES.SERVICE_AGREEMENT]: "terms",
              [MYPAGE_ROUTES.PRIVACY_POLICY]: "privacy",
              [MYPAGE_ROUTES.OPEN_LICENSE]: "licenses",
              [MYPAGE_ROUTES.COUPON]: {
                path: "coupons",
                initialRouteName: COUPON_ROUTES.LIST,
                screens: { [COUPON_ROUTES.LIST]: "", [COUPON_ROUTES.REGISTER]: "register" },
              },
              [MYPAGE_ROUTES.SETTINGS]: {
                path: "settings",
                initialRouteName: SETTINGS_ROUTES.MAIN,
                screens: {
                  [SETTINGS_ROUTES.MAIN]: "",
                  [SETTINGS_ROUTES.NICKNAME_CHANGE]: "nickname",
                  [SETTINGS_ROUTES.MEMBER_INFO_CHANGE]: "member",
                  [SETTINGS_ROUTES.REFUND_ACCOUNT]: "refund-account",
                  [SETTINGS_ROUTES.BLOCKED_SHOWROOMS]: "blocked",
                  [SETTINGS_ROUTES.WITHDRAWAL]: "withdrawal",
                },
              },
            },
          },
        },
      },
      // 인증 스택은 `{ params: { onSuccessLogin } }`로 열어 타입이 중첩 내비게이터 형태가 아니다 — 하위 주소는 타입 밖에서 준다
      [ROOT_ROUTES.AUTH]: {
        path: "login",
        screens: {
          [AUTH_ROUTES.AUTH_HOME]: { path: "", stringify: { onSuccessLogin: omitFromUrl } },
          [AUTH_ROUTES.IDENTITY_VERIFY]: {
            path: "verify",
            stringify: { registerToken: omitFromUrl, onSuccessLogin: omitFromUrl },
          },
          [AUTH_ROUTES.VERIFY_FAILED]: {
            path: "verify-failed",
            stringify: { registerToken: omitFromUrl, onSuccessLogin: omitFromUrl },
          },
          [AUTH_ROUTES.SIGN_UP]: {
            path: "signup",
            stringify: { registerToken: omitFromUrl, onSuccessLogin: omitFromUrl },
          },
          [AUTH_ROUTES.AGE_RESTRICTED]: "age-restricted",
        },
      } as never,
      [ROOT_ROUTES.COMMON]: {
        screens: {
          // 주소에서 읽은 값은 문자열이다 — 숫자로 바꿔 두지 않으면 앱 안에서 넘긴 번호(숫자)와
          // 쿼리 키 · 비교(`!==`)가 어긋나 같은 상품 · 게시물이 다른 것으로 취급된다
          [COMMON_ROUTES.SHOWROOM_DETAIL]: { path: "showroom/:showroomId", parse: { showroomId: Number } },
          // 크리에이터 SNS 링크 `/@handle` — 웹은 시작할 때 `/u/handle`로 바꿔 여기 닿는다(webPaths.web.ts)
          [COMMON_ROUTES.SHOWROOM_BY_ADDRESS]: "u/:showroomAddress",
          [COMMON_ROUTES.POST_DETAIL]: { path: "post/:postId", parse: { postId: Number } },
          [COMMON_ROUTES.PRODUCT_DETAIL]: {
            path: "product/:productId",
            parse: { productId: Number, groupBuyId: Number },
          },
          [COMMON_ROUTES.SEARCH]: "search",
          [COMMON_ROUTES.CART]: "cart",
          [COMMON_ROUTES.NOTIFICATION]: "notifications",
          [COMMON_ROUTES.WISHLIST]: "wishlist",
          [COMMON_ROUTES.TERMS_DOCUMENT]: "document/:termsType",
          [COMMON_ROUTES.ORDER_DETAIL]: { path: "order/:orderId", parse: { orderId: Number } },
          [COMMON_ROUTES.CLAIM_DETAIL]: { path: "claim/:claimId", parse: { claimId: Number } },
        },
      },
    },
  },
};
