import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AUTH_ROUTES, AuthStackParamList } from "@/common/router";
import AuthHomeView from "@/features/auth/views/AuthHomeView";
import SignUpView from "@/features/auth/views/SignUpView";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={AUTH_ROUTES.HOME} component={AuthHomeView} />
      <Stack.Screen name={AUTH_ROUTES.SIGN_UP} component={SignUpView} />
    </Stack.Navigator>
  );
}
