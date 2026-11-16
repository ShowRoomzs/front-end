import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ko";
import { registerRootComponent } from "expo";

import App from "./src/App";
import { registerBackgroundPushHandler } from "./src/features/push/lib/pushMessaging";

// FCM 백그라운드 수신 처리기 — 컴포넌트 등록보다 먼저 걸어야 한다(없으면 FCM이 경고를 남긴다)
registerBackgroundPushHandler();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
dayjs.extend(customParseFormat);
dayjs.locale("ko");
registerRootComponent(App);
