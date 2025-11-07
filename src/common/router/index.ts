import { NavigationProp, useNavigation } from "@react-navigation/native";

import { AuthStackParamList, HomeTabParamList, MainStackParamList, RootParamList } from "./types";

export { ROUTES, HOME_ROUTES, AUTH_ROUTES, MAIN_ROUTES } from "./routes";
export type { RouteName, HomeRouteName, AuthRouteName, MainRouteName } from "./routes";
export type { RootParamList, MainStackParamList, HomeTabParamList, AuthStackParamList } from "./types";

export const useAppNavigation = () => useNavigation<NavigationProp<RootParamList>>();
export const useMainNavigation = () => useNavigation<NavigationProp<MainStackParamList>>();
export const useHomeNavigation = () => useNavigation<NavigationProp<HomeTabParamList>>();
export const useAuthNavigation = () => useNavigation<NavigationProp<AuthStackParamList>>();
