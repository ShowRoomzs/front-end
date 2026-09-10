import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";
import { demoCategoryService } from "@/demo/services/content";
import { Category } from "@/features/category/types/category";

const realCategoryService = {
  get: async () => {
    const { data: response } = await apiInstance.get<Array<Category>>("/common/categories");

    return response;
  },
};

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realCategoryService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const categoryService: typeof realCategoryService = IS_DEMO
  ? { ...realCategoryService, ...demoCategoryService }
  : realCategoryService;
