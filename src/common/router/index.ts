import { NavigationProp, useNavigation } from "@react-navigation/native";

import { AuthStackParamList, HomeTabParamList, RootStackParamList } from "./types";

export { ROUTES, HOME_ROUTES, AUTH_ROUTES } from "./routes";
export type { RouteName, HomeRouteName, AuthRouteName } from "./routes";
export type { HomeTabParamList, AuthStackParamList } from "./types";

export const useHomeNavigation = () => useNavigation<NavigationProp<HomeTabParamList>>();
export const useAuthNavigation = () => useNavigation<NavigationProp<AuthStackParamList>>();
export const useMainNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
