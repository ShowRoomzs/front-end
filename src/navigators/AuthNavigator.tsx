import { RouteProp, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { AUTH_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { AuthStackParamList, RootStackParamList } from "@/common/router/types";
import TermsHeader from "@/features/auth/components/TermsHeader/TermsHeader";
import AgeRestrictedView from "@/features/auth/views/AgeRestrictedView";
import AuthHomeView from "@/features/auth/views/AuthHomeView";
import IdentityVerifyView from "@/features/auth/views/IdentityVerifyView";
import SignUpView from "@/features/auth/views/SignUpView";
import TermsView from "@/features/auth/views/TermsView";
import VerifyFailedView from "@/features/auth/views/VerifyFailedView";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const route = useRoute<RouteProp<RootStackParamList, typeof ROOT_ROUTES.AUTH>>();
  const onSuccessLogin = route.params?.params?.onSuccessLogin;

  return (
    // 다른 네비게이터와 같은 규칙 — 상단 인셋은 네비게이터가 한 번만 책임진다
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <Stack.Navigator initialRouteName={AUTH_ROUTES.AUTH_HOME}>
        <Stack.Screen
          options={{ headerShown: false }}
          name={AUTH_ROUTES.AUTH_HOME}
          component={AuthHomeView}
          initialParams={{ onSuccessLogin }}
        />
        {/* 가입 흐름의 화면들은 각자 ScreenHeader를 그린다 — 네비게이터 헤더는 끈다 */}
        <Stack.Screen
          options={{ headerShown: false }}
          name={AUTH_ROUTES.IDENTITY_VERIFY}
          component={IdentityVerifyView}
          initialParams={{ onSuccessLogin }}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name={AUTH_ROUTES.AGE_RESTRICTED}
          component={AgeRestrictedView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name={AUTH_ROUTES.VERIFY_FAILED}
          component={VerifyFailedView}
          initialParams={{ onSuccessLogin }}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name={AUTH_ROUTES.SIGN_UP}
          component={SignUpView}
          initialParams={{ onSuccessLogin }}
        />
        <Stack.Screen
          name={AUTH_ROUTES.TERMS}
          component={TermsView}
          options={{ header: TermsHeader, presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
