import { apiInstance } from "@/common/lib/apiInstance";
import { Category } from "@/features/auth/types/category";

export const categoryService = {
  getCategories: async () => {
    const { data: response } = await apiInstance.get<Array<Category>>("/common/categories");

    return response;
  },
};
