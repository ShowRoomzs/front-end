/**
 * 약관·정책 문서 (C18 문서 뷰어) — back-end `showroomz.api.app.terms.dto`.
 *
 * 소비자에게는 시행 중인 버전의 원문만 내려온다. 시행 예정 버전은 시행일 00:00 전까지 노출되지
 * 않고, 과거 버전도 내려오지 않는다 — 화면이 버전을 고르는 UI를 가질 이유가 없다.
 */
export type TermsType = "TERMS_OF_SERVICE" | "PRIVACY_POLICY" | "MARKETING_CONSENT";
export type TermsTarget = "USER" | "CREATOR" | "SELLER";

export interface TermsDocument {
  documentId: number;
  name: string;
  type: TermsType;
  typeName: string;
  target: TermsTarget;
  targetName: string;
  /** 화면 표기용 버전 — "v3.1" */
  version: string;
  /** 시행일 — 뷰어 상단에 고정 표기한다 */
  effectiveDate: string;
}

export interface TermsDocumentDetail extends TermsDocument {
  content: string;
}
