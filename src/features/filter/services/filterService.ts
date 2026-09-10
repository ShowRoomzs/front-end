import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";
import { demoFilterService } from "@/demo/services/settings";
import { Filter } from "@/features/filter/types/filter";

const realFilterService = {
  get: async () => {
    const { data: response } = await apiInstance.get<Array<Filter>>("/common/filters");

    return response;
  },
};

/** 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다 */
export const filterService: typeof realFilterService = IS_DEMO
  ? { ...realFilterService, ...demoFilterService }
  : realFilterService;
