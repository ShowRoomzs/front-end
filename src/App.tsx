import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useInit } from "@/common/hooks/useInit";
import { queryClient } from "@/common/lib/queryClient";
import PortalProvider from "@/common/providers/PortalProvider/PortalProvider";
import SplashProvider, { NATIVE_FADE_MS } from "@/common/providers/SplashProvider/SplashProvider";
import { linking } from "@/common/router/linking";
import { navigationRef } from "@/common/router/navigationRef";
import AccountStatusHost from "@/features/account/components/AccountStatusHost";
import PaymentRedirectHost from "@/features/order/components/PaymentRedirectHost/PaymentRedirectHost";
import MainNavigator from "@/navigators/MainNavigator";

// 네이티브 스플래시는 SplashProvider가 워드마크 오버레이를 띄운 뒤에 닫는다
SplashScreen.preventAutoHideAsync();
// 안드로이드 네이티브 스플래시(흰 화면)가 걷히는 길이 — 그 아래 워드마크가 이 시간 동안 페이드인된다(시안 C19, 0.2초)
SplashScreen.setOptions({ duration: NATIVE_FADE_MS, fade: true });

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
  },
};

export default function App() {
  const isReady = useInit();

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
            <NavigationContainer ref={navigationRef} theme={THEME} linking={linking}>
              <PortalProvider>
                <MainNavigator />
                <AccountStatusHost />
                {/* 웹 모바일 결제가 결제사 페이지에서 돌아오면 결과를 확정한다(앱은 아무것도 하지 않는다) */}
                <PaymentRedirectHost />
              </PortalProvider>
            </NavigationContainer>
          </SplashProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
