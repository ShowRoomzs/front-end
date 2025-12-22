import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";

import { useInit } from "@/common/hooks/useInit";
import { ROOT_ROUTES } from "@/common/router/routes";
import { RootStackParamList } from "@/common/router/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  const isLoaded = useInit();

  if (!isLoaded) {
    return null; // TODO : spinner 추가
  }

  return (
    <Stack.Navigator initialRouteName={ROOT_ROUTES.HOME} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROOT_ROUTES.HOME} component={HomeNavigator} />
      <Stack.Screen
        name={ROOT_ROUTES.AUTH}
        component={AuthNavigator}
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack.Navigator>
  );
}
