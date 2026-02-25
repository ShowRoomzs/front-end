import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  AuthStackParamList,
  CategoryStackParamList,
  CommonStackParamList,
  CouponStackParamList,
  HomeTabParamList,
  MypageStackParamList,
  RootStackParamList,
} from "@/common/router/types";

export { ROUTES, HOME_ROUTES, CATEGORY_ROUTES, AUTH_ROUTES, COUPON_ROUTES } from "./routes";
export type { RouteName, HomeRouteName, CategoryRouteName, AuthRouteName } from "./routes";
export type {
  HomeTabParamList,
  CategoryStackParamList,
  AuthStackParamList,
  CouponStackParamList,
} from "./types";

export const useHomeNavigation = () => useNavigation<NavigationProp<HomeTabParamList>>();
export const useCategoryNavigation = () => useNavigation<NavigationProp<CategoryStackParamList>>();
export const useAuthNavigation = () => useNavigation<NavigationProp<AuthStackParamList>>();
export const useMainNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
export const useCommonNavigation = () => useNavigation<NativeStackNavigationProp<CommonStackParamList>>();
export const useMypageNavigation = () => useNavigation<NavigationProp<MypageStackParamList>>();
export const useCouponNavigation = () => useNavigation<NativeStackNavigationProp<CouponStackParamList>>();
