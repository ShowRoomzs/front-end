import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import TermsDocumentBody from "@/features/terms/components/TermsDocumentBody/TermsDocumentBody";
import { TermsType as TermsDocumentType } from "@/features/terms/types/terms";

/**
 * 로그인·가입 흐름에서 여는 약관 원문 (모달).
 *
 * 헤더는 네비게이터의 TermsHeader(닫기 X)가 그리고, 본문은 마이의 문서 화면과 같은
 * TermsDocumentBody를 쓴다 — 동의를 받기 전에 보여 주는 글과 가입 후에 다시 찾아보는 글이
 * 다르면 안 된다.
 */
export type TermsType = "privacy" | "service" | "marketing";

const TERMS_DOCUMENT_TYPE_MAP: Record<TermsType, TermsDocumentType> = {
  service: "TERMS_OF_SERVICE",
  privacy: "PRIVACY_POLICY",
  marketing: "MARKETING_CONSENT",
};

export default function TermsView(
  props: NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.TERMS>
) {
  const { route } = props;
  const { termsType } = route.params;

  return (
    <View className="flex-1 bg-white">
      <TermsDocumentBody termsType={TERMS_DOCUMENT_TYPE_MAP[termsType]} />
    </View>
  );
}
