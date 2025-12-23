import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo } from "react";

import TermsCheckboxGroup, { TermsItem } from "@/common/components/TermsCheckboxGroup/TermsCheckboxGroup";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";

interface AuthTermsCheckboxGroupProps {
  allCheckLabel?: string;
}

export default function AuthTermsCheckboxGroup(props: AuthTermsCheckboxGroupProps) {
  const { allCheckLabel = "전체 동의" } = props;
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const termsItems: Array<TermsItem> = useMemo(
    () => [
      {
        id: "privacy",
        label: "개인정보처리방침",
        required: true,
        onPressView: () => navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "privacy" }),
      },
      {
        id: "service",
        label: "서비스 이용 약관",
        required: true,
        onPressView: () => navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "service" }),
      },
    ],
    [navigation]
  );

  return <TermsCheckboxGroup items={termsItems} allCheckLabel={allCheckLabel} />;
}
