import { useQuery } from "@tanstack/react-query";

import { TERMS_QUERY_KEY } from "@/features/terms/constants/queryKey";
import { termsService } from "@/features/terms/services/termsService";
import { TermsDocument, TermsTarget, TermsType } from "@/features/terms/types/terms";

const TERMS_STALE_TIME = 1000 * 60 * 60;

/**
 * 소비자가 볼 문서 하나 — 같은 종류에 소비자 전용(USER)과 전체(ALL) 문서가 함께 있으면 소비자 전용이 우선이다.
 * 서버는 종류 → 문서 id 순으로만 정렬해 주므로 첫 줄을 그대로 쓰면 먼저 등록된 전체 문서가 걸릴 수 있다.
 */
export function pickConsumerDocument(documents: Array<TermsDocument> | undefined) {
  return documents?.find(document => document.target === "USER") ?? documents?.[0];
}

export function useGetTermsList(params?: { type?: TermsType; target?: TermsTarget }) {
  return useQuery({
    queryKey: [TERMS_QUERY_KEY.TERMS_LIST, params],
    queryFn: () => termsService.getList(params),
    staleTime: TERMS_STALE_TIME,
  });
}

export function useGetTermsDetail(documentId: number | undefined) {
  return useQuery({
    queryKey: [TERMS_QUERY_KEY.TERMS_DETAIL, documentId],
    queryFn: () => termsService.getDetail(documentId as number),
    enabled: !!documentId,
    staleTime: TERMS_STALE_TIME,
  });
}
