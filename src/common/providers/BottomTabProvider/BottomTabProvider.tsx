import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { ReactNode, useCallback, useRef, useState } from "react";

import { BottomTabContext } from "@/common/providers/BottomTabProvider/context";
import { HomeRouteName } from "@/common/router";

interface BottomTabProviderProps {
  children: ReactNode;
}

export default function BottomTabProvider(props: BottomTabProviderProps) {
  const { children } = props;
  const navigationRef = useRef<NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const navigate = useCallback((routeName: HomeRouteName) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(routeName);
    }
  }, []);

  const setNavigation = useCallback(
    (navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>) => {
      navigationRef.current = navigation;
    },
    []
  );

  return (
    <BottomTabContext.Provider
      value={{
        isVisible,
        show,
        hide,
        toggle,
        navigate,
        setNavigation,
      }}
    >
      {children}
    </BottomTabContext.Provider>
  );
}
