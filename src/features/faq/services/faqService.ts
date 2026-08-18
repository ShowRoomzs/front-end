import { apiInstance } from "@/common/lib/apiInstance";
import { Faq, FaqCategory } from "@/features/faq/types/faq";

export const faqService = {
  /** 정렬은 운영자가 정한 카테고리 내 노출 순서를 그대로 따른다 */
  getList: async (params?: { category?: string; keyword?: string }) => {
    const { data } = await apiInstance.get<Array<Faq>>("/user/faqs", { params });

    return data;
  },

  getCategories: async () => {
    const { data } = await apiInstance.get<Array<FaqCategory>>("/common/faqs/categories");

    return data;
  },
};
