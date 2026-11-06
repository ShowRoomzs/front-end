import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import InfoBanner from "@/common/components/InfoBanner/InfoBanner";
import Skeleton from "@/common/components/Skeleton/Skeleton";
import Typography from "@/common/components/Typography/Typography";
import TermsBodySkeleton from "@/features/terms/components/TermsBodySkeleton/TermsBodySkeleton";
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

/** 조 제목 — 「제1조 (목적)」처럼 시작하는 줄 */
const ARTICLE_HEADING = /^제\s*\d+\s*조/;

/**
 * 블록의 첫 줄이 조 제목이면 떼어 낸다(시안 C18 — 조 제목 14.5/600 잉크 + 문단 13/1.85).
 * 원문은 평문이라 형식이 없다. 조 제목이 아닌 블록(전문 · 부칙 문단)은 문단만 그린다.
 */
function splitArticle(block: string): { heading: string | null; body: string } {
  const [firstLine, ...rest] = block.trim().split("\n");

  if (ARTICLE_HEADING.test(firstLine.trim())) {
    return { heading: firstLine.trim(), body: rest.join("\n").trim() };
  }
  return { heading: null, body: block.trim() };
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
    () =>
      (document?.content ?? "")
        .split(/\n{2,}/)
        .filter(block => block.trim().length > 0)
        .map(splitArticle),
    [document?.content]
  );

  if (isLoading) {
    return (
      <Skeleton>
        <TermsBodySkeleton />
      </Skeleton>
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
          {/* 서버 버전은 「v3.1」 꼴이다 — 앞에 「버전」을 붙이므로 v는 뗀다(시안 「버전 1.2」) */}
          시행일 {document.effectiveDate} · 버전 {String(document.version).replace(/^v/i, "")}
        </Typography>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        {paragraphs.map((paragraph, ix) => (
          <View key={`terms-${ix}`} style={{ marginBottom: 20 }}>
            {!!paragraph.heading && (
              <Typography
                style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 21.75 }}
                className="text-ink"
              >
                {paragraph.heading}
              </Typography>
            )}
            {!!paragraph.body && (
              <Typography
                style={{ fontSize: 13, lineHeight: 24.05, marginTop: paragraph.heading ? 8 : 0 }}
                className="text-ink76"
              >
                {paragraph.body}
              </Typography>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
