import { QueryClientProvider } from "@tanstack/react-query";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "./common/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider className="flex-1">
          <InitApp />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

function InitApp() {
  return <View></View>;
}
