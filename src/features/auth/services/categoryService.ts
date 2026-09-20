import { apiInstance } from "@/common/lib/apiInstance";
import { Category } from "@/features/category/types/category";

export const categoryService = {
  get: async () => {
    const { data: response } = await apiInstance.get<Array<Category>>("/common/categories");

    return response;
  },
};
