import { RouteProp, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AUTH_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { AuthStackParamList, RootStackParamList } from "@/common/router/types";
import SignUpHeader from "@/features/auth/components/SignUpHeader/SignUpHeader";
import TermsHeader from "@/features/auth/components/TermsHeader/TermsHeader";
import AuthHomeView from "@/features/auth/views/AuthHomeView";
import SignUpView from "@/features/auth/views/SignUpView";
import TermsView from "@/features/auth/views/TermsView";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const route = useRoute<RouteProp<RootStackParamList, typeof ROOT_ROUTES.AUTH>>();
  const onSuccessLogin = route.params?.params?.onSuccessLogin;

  return (
    <Stack.Navigator initialRouteName={AUTH_ROUTES.AUTH_HOME}>
      <Stack.Screen
        options={{ headerShown: false }}
        name={AUTH_ROUTES.AUTH_HOME}
        component={AuthHomeView}
        initialParams={{ onSuccessLogin }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.SIGN_UP}
        component={SignUpView}
        initialParams={{ onSuccessLogin }}
        options={{ header: SignUpHeader }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.TERMS}
        component={TermsView}
        options={{ header: TermsHeader, presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
