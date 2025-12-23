import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function TermsHeader(props: NativeStackHeaderProps) {
  const { navigation, route } = props;
  const inset = useSafeAreaInsets();
  const termsType = (route.params as AuthStackParamList[typeof AUTH_ROUTES.TERMS]).termsType;
  const title = termsType === "privacy" ? "개인정보처리방침" : "서비스 이용 약관";

  return (
    <Header
      style={{ paddingTop: inset.top }}
      className="px-20"
      renderLeft={
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
          <Icon icon={COMMON_ASSETS.back} width={24} height={24} />
        </TouchableOpacity>
      }
      title={title}
    />
  );
}
