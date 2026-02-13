import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useInit } from "@/common/hooks/useInit";
import { queryClient } from "@/common/lib/queryClient";
import PortalProvider from "@/common/providers/PortalProvider/PortalProvider";
import SplashProvider from "@/common/providers/SplashProvider/SplashProvider";
import MainNavigator from "@/navigators/MainNavigator";

SplashScreen.preventAutoHideAsync();

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
  },
};

export default function App() {
  const isReady = useInit();

  useEffect(() => {
    // native 스플래시 닫기
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider className="flex-1">
          <SplashProvider isReady={isReady}>
            <NavigationContainer theme={THEME}>
              <PortalProvider>
                <MainNavigator />
              </PortalProvider>
            </NavigationContainer>
          </SplashProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
