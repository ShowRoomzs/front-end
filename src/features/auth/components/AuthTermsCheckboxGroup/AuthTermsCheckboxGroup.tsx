import { useMemo } from "react";

import TermsCheckboxGroup, { TermsItem } from "@/common/components/TermsCheckboxGroup/TermsCheckboxGroup";
import { AUTH_ROUTES, useAuthNavigation } from "@/common/router";

interface AuthTermsCheckboxGroupProps {
  allCheckLabel?: string;
  onChange: (isAllChecked: boolean) => void;
}

export default function AuthTermsCheckboxGroup(props: AuthTermsCheckboxGroupProps) {
  const { allCheckLabel = "전체 동의", onChange } = props;
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
        label: "마케팅 활용 동의",
        required: false,
        onPressView: () => navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "marketing" }),
      },
    ],
    [navigation]
  );

  return <TermsCheckboxGroup items={termsItems} allCheckLabel={allCheckLabel} onChange={onChange} />;
}
