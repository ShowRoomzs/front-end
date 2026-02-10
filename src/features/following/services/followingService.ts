import { apiInstance } from "@/common/lib/apiInstance";
import { FollowingListResponse } from "@/features/following/types/following";

export const followingService = {
  get: async () => {
    const { data: response } = await apiInstance.get<FollowingListResponse>("/user/shops/following");

    return response;
  },
  create: async (shopId: number) => {
    const { data: response } = await apiInstance.post<void>(`/user/shops/${shopId}/follow`);

    return response;
  },
  delete: async (shopId: number) => {
    const { data: response } = await apiInstance.delete<void>(`/user/shops/${shopId}/follow`);

    return response;
  },
};
