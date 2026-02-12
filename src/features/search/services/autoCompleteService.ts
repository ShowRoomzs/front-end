import { apiInstance } from "@/common/lib/apiInstance";
import { AutoCompleteResponse } from "@/features/search/types/autoComplete";

export const autoCompleteService = {
  get: async (keyword: string) => {
    const { data: response } = await apiInstance.get<AutoCompleteResponse>(`/user/search/autocomplete`, {
      params: {
        keyword,
      },
    });

    return response;
  },
};
