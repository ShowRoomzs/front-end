import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";

export type TermsType = "privacy" | "service";

export default function TermsView(
  props: NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.TERMS>
) {
  const { route } = props;
  const { termsType } = route.params;

  return (
    <View>
      <Typography>{termsType === "privacy" ? "개인정보처리방침" : "서비스 이용 약관"}</Typography>
    </View>
  );
}
