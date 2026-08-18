import TermsDocumentView from "@/features/terms/views/TermsDocumentView";

/** 개인정보 처리방침 — C18 문서 뷰어에 유형만 지정해 넘긴다 */
export default function PrivacyPolicyView() {
  return <TermsDocumentView termsType="PRIVACY_POLICY" />;
}
