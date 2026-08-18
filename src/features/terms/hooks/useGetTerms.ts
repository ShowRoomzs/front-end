import { useQuery } from "@tanstack/react-query";

import { TERMS_QUERY_KEY } from "@/features/terms/constants/queryKey";
import { termsService } from "@/features/terms/services/termsService";
import { TermsTarget, TermsType } from "@/features/terms/types/terms";

const TERMS_STALE_TIME = 1000 * 60 * 60;

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
