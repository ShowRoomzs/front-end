import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
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
      [ROOT_ROUTES.COMMON]: {
        screens: {
          [COMMON_ROUTES.SHOWROOM_DETAIL]: "showroom/:showroomId",
          [COMMON_ROUTES.POST_DETAIL]: "post/:postId",
          [COMMON_ROUTES.PRODUCT_DETAIL]: "product/:productId",
        },
      },
    },
  },
};
