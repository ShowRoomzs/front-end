import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import InfoBanner from "@/common/components/InfoBanner/InfoBanner";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useMypageNavigation } from "@/common/router";
import { useGetTermsDetail, useGetTermsList } from "@/features/terms/hooks/useGetTerms";
import { TermsType } from "@/features/terms/types/terms";

/**
 * C18 문서 뷰어 — 이용약관 · 개인정보 처리방침이 공유하는 화면이다.
 *
 * 소비자에게는 시행 중인 버전 하나만 내려오므로 버전을 고르는 UI가 없고, 대신 상단에
 * 시행일과 버전을 고정 표기한다 — 지금 읽는 것이 언제부터 효력이 있는 글인지가
 * 약관에서는 본문만큼 중요하다.
 */
interface TermsDocumentViewProps {
  termsType: TermsType;
}

export default function TermsDocumentView(props: TermsDocumentViewProps) {
  const { termsType } = props;
  const navigation = useMypageNavigation();

  const { data: documents, isLoading: isListLoading } = useGetTermsList({
    type: termsType,
    target: "USER",
  });
  const documentId = documents?.[0]?.documentId;
  const { data: document, isLoading: isDetailLoading } = useGetTermsDetail(documentId);

  const isLoading = isListLoading || isDetailLoading;

  /** 원문은 빈 줄로 조를 나눈 평문이다 — 문단마다 간격을 줘야 조문이 읽힌다 */
  const paragraphs = useMemo(
    () => (document?.content ?? "").split(/\n{2,}/).filter(block => block.trim().length > 0),
    [document?.content]
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      );
    }

    if (!document) {
      return (
        <View className="px-20 pt-20">
          <InfoBanner variant="note" message="문서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="border-b-[0.5px] border-dividerProduct px-20 pb-14 pt-18">
          <Typography style={{ fontSize: 12, lineHeight: 19.2 }} className="text-gray45">
            시행일 {document.effectiveDate} · 버전 {document.version}
          </Typography>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
          {paragraphs.map((paragraph, ix) => (
            <Typography
              key={`terms-${ix}`}
              style={{ fontSize: 13, lineHeight: 24.05, marginBottom: 20 }}
              className="text-ink76"
            >
              {paragraph.trim()}
            </Typography>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={document?.name ?? documents?.[0]?.name} onPressBack={navigation.goBack} />
      {renderBody()}
    </View>
  );
}
