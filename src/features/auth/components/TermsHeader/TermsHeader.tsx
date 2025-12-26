import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function TermsHeader(props: NativeStackHeaderProps) {
  const { navigation, route } = props;
  const termsType = (route.params as AuthStackParamList[typeof AUTH_ROUTES.TERMS]).termsType;

  const title = useMemo(() => {
    switch (termsType) {
      case "marketing":
        return "마케팅 목적의 개인정보 수집, 이용 동의";
      case "service":
        return "서비스 이용 약관";
      case "privacy":
        return "개인정보처리방침";
    }
  }, [termsType]);

  return (
    <Header
      className="px-20 py-20"
      renderRight={
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
          <Icon icon={COMMON_ASSETS.closeBlack} />
        </TouchableOpacity>
      }
      title={title}
    />
  );
}
