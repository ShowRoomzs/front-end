import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";

export type TermsType = "privacy" | "service";

export default function TermsView(
  props: NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.TERMS>
) {
  const { route } = props;
  const { termsType } = route.params;

  return <View></View>;
}
