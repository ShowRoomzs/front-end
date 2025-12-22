import { RouteProp, useRoute } from "@react-navigation/native";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";

export default function SignUpView() {
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.SIGN_UP>>();
  const { onSuccessLogin } = route.params || {};

  console.log("onSuccessLogin", onSuccessLogin);
  // 회원가입 성공 시 onSuccessLogin 콜백 호출(테스트 필요)

  return (
    <View className="flex-1 items-center justify-center">
      <Typography className="text-xl">회원가입 화면</Typography>
    </View>
  );
}
