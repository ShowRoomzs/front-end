import { isAxiosError } from "axios";

import { apiInstance } from "@/common/lib/apiInstance";
import { HomeSummary } from "@/features/home/types/home";

export const homeService = {
  /** C1 홈 요약 — 서버에 경로가 없으면(404) 빈 값이라 배지도 없고 빈 상태는 피드로만 판정한다 */
  getSummary: async (): Promise<HomeSummary> => {
    try {
      const { data } = await apiInstance.get<HomeSummary>("/user/home/summary");

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return {};
      }
      throw error;
    }
  },
};
