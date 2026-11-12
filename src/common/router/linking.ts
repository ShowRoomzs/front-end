import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { COMMON_ROUTES, HOME_ROUTES, MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { RootStackParamList } from "@/common/router/types";

/**
 * 딥링크 — 앱 바깥에서 쇼룸·게시물·상품으로 바로 착지시킨다.
 *
 * **C4 쇼룸은 SNS 프로필 링크로 들어오는 것이 기본 동선이다.** 이 설정이 없으면 링크를 눌러도
 * 앱만 열리고 홈에 떨어져, 크리에이터가 올린 링크가 아무 데로도 가지 않는다.
 * 게시물 ⋯의 [링크 복사]가 만드는 주소도 여기서 받는다.
 *
 * `Linking.createURL("")`을 접두사에 함께 넣는 이유는 **Expo Go와 개발 빌드의 주소가 다르기**
 * 때문이다(`exp://…` / `showroomz://`). 배포 빌드에서는 앱 스킴만 쓰인다.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL(""), "showroomz://"],
  config: {
    screens: {
      /*
        하단 탭의 주소 — 정하지 않으면 화면 이름이 그대로 경로가 돼 웹 주소창에 /home/home ·
        /home/mypage/main이 보인다. 홈은 사이트 첫 주소(/)다. 마이 안쪽 화면은 /my/… 아래에 이름대로 붙는다
      */
      [ROOT_ROUTES.HOME]: {
        path: "",
        screens: {
          [HOME_ROUTES.HOME]: "",
          [HOME_ROUTES.FOLLOWING]: "following",
          [HOME_ROUTES.LIKE]: "likes",
          [HOME_ROUTES.MYPAGE]: {
            path: "my",
            screens: { [MYPAGE_ROUTES.MAIN]: "" },
          },
        },
      },
      [ROOT_ROUTES.COMMON]: {
        screens: {
          // 주소에서 읽은 값은 문자열이다 — 숫자로 바꿔 두지 않으면 앱 안에서 넘긴 번호(숫자)와
          // 쿼리 키 · 비교(`!==`)가 어긋나 같은 상품 · 게시물이 다른 것으로 취급된다
          [COMMON_ROUTES.SHOWROOM_DETAIL]: { path: "showroom/:showroomId", parse: { showroomId: Number } },
          [COMMON_ROUTES.POST_DETAIL]: { path: "post/:postId", parse: { postId: Number } },
          [COMMON_ROUTES.PRODUCT_DETAIL]: {
            path: "product/:productId",
            parse: { productId: Number, groupBuyId: Number },
          },
        },
      },
    },
  },
};
