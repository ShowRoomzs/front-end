import { useQuery } from "@tanstack/react-query";

import { categoryService } from "@/features/auth/services/categoryService";
import { CATEGORY_QUERY_KEY } from "@/features/category/constants/queryKey";

export function useGetCategory() {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY.CATEGORIES],
    queryFn: categoryService.get,
  });
}
