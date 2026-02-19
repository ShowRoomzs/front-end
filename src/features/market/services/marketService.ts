import { apiInstance } from "@/common/lib/apiInstance";
import { Market } from "@/features/market/types/market";

export const marketService = {
  getDetail: async (marketId: number) => {
    const { data: response } = await apiInstance.get<Market>(`/user/shops/${marketId}`);

    return response;
  },
};
