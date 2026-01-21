import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/features/auth/constants/queryKey";
import { categoryService } from "@/features/auth/services/categoryService";

export function useGetCategories() {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORIES],
    queryFn: categoryService.getCategories,
  });
}
