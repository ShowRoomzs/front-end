import TermsDocumentView from "@/features/terms/views/TermsDocumentView";

/** 서비스 이용약관 — C18 문서 뷰어에 유형만 지정해 넘긴다 */
export default function ServiceAgreementView() {
  return <TermsDocumentView termsType="TERMS_OF_SERVICE" />;
}
