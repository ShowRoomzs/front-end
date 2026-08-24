import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import InfoBanner from "@/common/components/InfoBanner/InfoBanner";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useGetTermsDetail, useGetTermsList } from "@/features/terms/hooks/useGetTerms";
import { TermsType } from "@/features/terms/types/terms";

/**
 * 약관·정책 원문 본문 (C18).
 *
 * 헤더를 갖지 않는 이유는 이 본문이 두 곳에서 쓰이기 때문이다 — 마이의 문서 화면은 뒤로가기
 * ScreenHeader를, 로그인/가입 흐름의 모달은 닫기 TermsHeader를 쓴다. 헤더가 다르다고 원문을
 * 두 벌 만들 이유는 없으므로 본문만 떼어 공유한다.
 *
 * 조회는 react-query가 같은 키로 묶어 주므로, 부르는 쪽이 제목을 위해 목록을 한 번 더 봐도
 * 요청이 늘지 않는다.
 */
interface TermsDocumentBodyProps {
  termsType: TermsType;
}

export default function TermsDocumentBody(props: TermsDocumentBodyProps) {
  const { termsType } = props;

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
}
