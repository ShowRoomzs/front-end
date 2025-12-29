import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ROOT_ROUTES } from "@/common/router/routes";
import { RootStackParamList } from "@/common/router/types";
import AuthNavigator from "@/navigators/AuthNavigator";
import CommonNavigator from "@/navigators/CommonNavigator";
import HomeNavigator from "@/navigators/HomeNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROOT_ROUTES.HOME} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROOT_ROUTES.HOME} component={HomeNavigator} />
      <Stack.Screen
        name={ROOT_ROUTES.AUTH}
        component={AuthNavigator}
        options={{ presentation: "containedModal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name={ROOT_ROUTES.COMMON} component={CommonNavigator} />
    </Stack.Navigator>
  );
}
