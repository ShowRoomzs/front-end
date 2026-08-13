import { useQuery } from "@tanstack/react-query";

import { INQUIRY_QUERY_KEY } from "../constants/queryKey";
import { inquiryService } from "../services/inquiryService";

export function useGetCategories() {
  return useQuery({
    queryKey: [INQUIRY_QUERY_KEY.INQUIRY_CATEGORY],
    queryFn: inquiryService.getCategories,
  });
}
