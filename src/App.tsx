import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useInit } from "@/common/hooks/useInit";
import { queryClient } from "@/common/lib/queryClient";
import PortalProvider from "@/common/providers/PortalProvider/PortalProvider";
import SplashProvider from "@/common/providers/SplashProvider/SplashProvider";
import { linking } from "@/common/router/linking";
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
          {/*
            앱 배경이 흰색으로 통일돼 있어 상태바 아이콘은 항상 어둡게 둔다.
            edgeToEdgeEnabled(app.config.ts)라 시스템이 자동으로 대비를 맞춰 주지 않는다.
          */}
          <StatusBar style="dark" />
          <SplashProvider isReady={isReady}>
            <NavigationContainer theme={THEME} linking={linking}>
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
