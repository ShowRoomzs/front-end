import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { createContext } from "react";

import { HomeRouteName } from "@/common/router";

export interface BottomTabContextValue {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  navigate: (routeName: HomeRouteName) => void;
  setNavigation: (navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>) => void;
}

export const BottomTabContext = createContext<BottomTabContextValue | null>(null);
