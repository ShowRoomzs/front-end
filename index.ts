import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ko";
import { registerRootComponent } from "expo";
import { NativeWindStyleSheet } from "nativewind";
import { Platform } from "react-native";

import App from "./src/App";
import { handleOAuthCallback } from "./src/features/auth/web/oauthCallback";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
dayjs.extend(customParseFormat);
dayjs.locale("ko");
// 웹에서도 className을 네이티브와 같은 스타일 객체로 바꾼다. NativeWind v2는 react-native-web을 보면
// CSS 클래스 출력으로 바꾸는데, 그 CSS를 만들 PostCSS 파이프라인이 없어 모든 className이 빈 값이 된다
if (Platform.OS === "web") {
  NativeWindStyleSheet.setOutput({ default: "native" });
}

// 웹 소셜 로그인 팝업이 돌아온 페이지면 결과만 원래 창에 넘기고 닫는다 — 앱을 띄우지 않는다(앱에서는 항상 false)
if (!handleOAuthCallback()) {
  registerRootComponent(App);
}
