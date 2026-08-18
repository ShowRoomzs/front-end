import { useQuery } from "@tanstack/react-query";

import { FAQ_QUERY_KEY } from "@/features/faq/constants/queryKey";
import { faqService } from "@/features/faq/services/faqService";

const FAQ_STALE_TIME = 1000 * 60 * 30;

export function useGetFaqCategories() {
  return useQuery({
    queryKey: [FAQ_QUERY_KEY.FAQ_CATEGORIES],
    queryFn: faqService.getCategories,
    staleTime: FAQ_STALE_TIME,
  });
}

export function useGetFaqList(category?: string) {
  return useQuery({
    queryKey: [FAQ_QUERY_KEY.FAQ_LIST, category],
    queryFn: () => faqService.getList({ category }),
    staleTime: FAQ_STALE_TIME,
  });
}
