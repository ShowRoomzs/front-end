import { createNavigationContainerRef } from "@react-navigation/native";

import { RootStackParamList } from "@/common/router/types";

/**
 * 화면 밖(전역 시트 · 알림 처리)에서 이동할 때 쓴다 — 화면 안에서는 `useNavigation` 계열을 쓴다.
 * `App`의 `NavigationContainer`에 물려 있다.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
