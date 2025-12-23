import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { queryClient } from "@/common/lib/queryClient";
import OverlayProvider from "@/common/providers/OverlayProvider";
import MainNavigator from "@/navigators/MainNavigator";

const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider className="flex-1">
          <NavigationContainer theme={THEME}>
            <OverlayProvider>
              <SafeAreaView className="flex-1">
                <MainNavigator />
              </SafeAreaView>
            </OverlayProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
