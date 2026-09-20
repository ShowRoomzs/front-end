import { apiInstance } from "@/common/lib/apiInstance";
import { Filter } from "@/features/filter/types/filter";

export const filterService = {
  get: async () => {
    const { data: response } = await apiInstance.get<Array<Filter>>("/common/filters");

    return response;
  },
};
