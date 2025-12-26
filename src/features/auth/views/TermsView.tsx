import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";

export type TermsType = "privacy" | "service" | "marketing";

export default function TermsView(
  props: NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.TERMS>
) {
  const { route } = props;
  const { termsType } = route.params;
  const content = useMemo(() => {
    switch (termsType) {
      case "marketing":
        return <Typography>마케팅 목적의 개인정보 수집, 이용 동의</Typography>;
      case "service":
        return <Typography>서비스 이용 약관</Typography>;
      case "privacy":
        return <Typography>개인정보처리방침</Typography>;
    }
  }, [termsType]);

  return (
    <View>
      <Typography>{content}</Typography>
    </View>
  );
}
