import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";

import { MAIN_ROUTES, MainStackParamList } from "@/common/router";

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.MAIN}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={MAIN_ROUTES.MAIN} component={HomeNavigator} />
      <Stack.Screen name={MAIN_ROUTES.AUTH} component={AuthNavigator} />
    </Stack.Navigator>
  );
}
