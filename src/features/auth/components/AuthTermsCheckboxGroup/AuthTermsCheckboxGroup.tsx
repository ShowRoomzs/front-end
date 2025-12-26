import { useMemo } from "react";

import TermsCheckboxGroup, { TermsItem } from "@/common/components/TermsCheckboxGroup/TermsCheckboxGroup";
import { AUTH_ROUTES, useAuthNavigation } from "@/common/router";

interface AuthTermsCheckboxGroupProps {
  onChange: (isAllChecked: boolean) => void;
}

export default function AuthTermsCheckboxGroup(props: AuthTermsCheckboxGroupProps) {
  const { onChange } = props;
  const navigation = useAuthNavigation();

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
      {
        id: "marketing",
        label: "마케팅 목적의 개인정보 수집, 이용 동의",
        required: false,
        onPressView: () => navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "marketing" }),
      },
    ],
    [navigation]
  );

  return <TermsCheckboxGroup items={termsItems} onChange={onChange} />;
}
