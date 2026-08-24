import { View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { useMypageNavigation } from "@/common/router";
import TermsDocumentBody from "@/features/terms/components/TermsDocumentBody/TermsDocumentBody";
import { useGetTermsList } from "@/features/terms/hooks/useGetTerms";
import { TermsType } from "@/features/terms/types/terms";

/**
 * C18 문서 뷰어 — 이용약관 · 개인정보 처리방침이 공유하는 화면이다.
 *
 * 소비자에게는 시행 중인 버전 하나만 내려오므로 버전을 고르는 UI가 없고, 대신 본문 상단에
 * 시행일과 버전을 고정 표기한다 — 지금 읽는 것이 언제부터 효력이 있는 글인지가
 * 약관에서는 본문만큼 중요하다.
 */
interface TermsDocumentViewProps {
  termsType: TermsType;
}

export default function TermsDocumentView(props: TermsDocumentViewProps) {
  const { termsType } = props;
  const navigation = useMypageNavigation();

  // 제목은 문서 이름을 그대로 쓴다 — 본문과 같은 쿼리라 요청이 늘지 않는다
  const { data: documents } = useGetTermsList({ type: termsType, target: "USER" });

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={documents?.[0]?.name} onPressBack={navigation.goBack} />
      <TermsDocumentBody termsType={termsType} />
    </View>
  );
}
