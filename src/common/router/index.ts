import { NavigationProp, useNavigation } from "@react-navigation/native";

import {
  AuthStackParamList,
  CategoryStackParamList,
  HomeTabParamList,
  RootStackParamList,
} from "@/common/router/types";

export { ROUTES, HOME_ROUTES, CATEGORY_ROUTES, AUTH_ROUTES } from "./routes";
export type { RouteName, HomeRouteName, CategoryRouteName, AuthRouteName } from "./routes";
export type { HomeTabParamList, CategoryStackParamList, AuthStackParamList } from "./types";

export const useHomeNavigation = () => useNavigation<NavigationProp<HomeTabParamList>>();
export const useCategoryNavigation = () => useNavigation<NavigationProp<CategoryStackParamList>>();
export const useAuthNavigation = () => useNavigation<NavigationProp<AuthStackParamList>>();
export const useMainNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
