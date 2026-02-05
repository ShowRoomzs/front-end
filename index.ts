import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ko";
import { registerRootComponent } from "expo";

import App from "./src/App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
dayjs.extend(customParseFormat);
dayjs.locale("ko");
registerRootComponent(App);
