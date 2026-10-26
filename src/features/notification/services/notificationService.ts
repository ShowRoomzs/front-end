import { isAxiosError } from "axios";

import { apiInstance } from "@/common/lib/apiInstance";
import { NotificationListResponse } from "@/features/notification/types/notification";

const PAGE_SIZE = 20;

/** 서버에 아직 그 경로가 없다(개발 서버 미배포 2026-10-24) — 화면은 「준비 중」을 그린다 */
function isNotDeployed(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404;
}

export const notificationService = {
  /** 최근 90일 · 최신순. 서버에 경로가 없으면 null */
  getList: async (page: number): Promise<NotificationListResponse | null> => {
    try {
      const { data } = await apiInstance.get<NotificationListResponse>("/user/notifications", {
        params: { page, size: PAGE_SIZE },
      });

      return data;
    } catch (error) {
      if (isNotDeployed(error)) {
        return null;
      }
      throw error;
    }
  },
  /** 탭하면 읽음 — 여러 번 불러도 같다 */
  markRead: async (notificationId: number) => {
    await apiInstance.post(`/user/notifications/${notificationId}/read`);
  },
  /** 목록에 들어오면 종 배지만 초기화한다(각 알림의 읽음은 그대로) */
  seeBadge: async () => {
    try {
      await apiInstance.post("/user/notifications/badge/seen");
    } catch (error) {
      if (!isNotDeployed(error)) {
        throw error;
      }
    }
  },
  /** 종 배지 — C1 홈 요약의 `notificationBadgeCount`. 서버에 경로나 값이 없으면 0 */
  getBadgeCount: async (): Promise<number> => {
    try {
      const { data } = await apiInstance.get<{ notificationBadgeCount?: number }>("/user/home/summary");

      return data.notificationBadgeCount ?? 0;
    } catch (error) {
      if (isNotDeployed(error)) {
        return 0;
      }
      throw error;
    }
  },
};
