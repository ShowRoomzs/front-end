import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";
import { demoFaqService } from "@/demo/services/content";
import { Faq, FaqCategory } from "@/features/faq/types/faq";

const realFaqService = {
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

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realFaqService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const faqService: typeof realFaqService = IS_DEMO
  ? { ...realFaqService, ...demoFaqService }
  : realFaqService;
