import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import AuthHomeView from "@/features/auth/views/AuthHomeView";
import SignUpView from "@/features/auth/views/SignUpView";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={AUTH_ROUTES.AUTH_HOME} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_ROUTES.AUTH_HOME} component={AuthHomeView} />
      <Stack.Screen name={AUTH_ROUTES.SIGN_UP} component={SignUpView} />
    </Stack.Navigator>
  );
}
