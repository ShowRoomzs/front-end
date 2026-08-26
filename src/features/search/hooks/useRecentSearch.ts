import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ASYNC_STORAGE } from "@/common/constants/asyncStorage";
import { useUserStore } from "@/common/stores/useUserStore";
import { useCreateRecentSearchMutation } from "@/features/search/hooks/useCreateRecentSearchMutation";
import { useCreateRecentShowroomMutation } from "@/features/search/hooks/useCreateRecentShowroomMutation";
import { useDeleteAllRecentSearchMutation } from "@/features/search/hooks/useDeleteAllRecentSearchMutation";
import { useDeleteRecentSearchMutation } from "@/features/search/hooks/useDeleteRecentSearchMutation";
import { useGetRecentSearch } from "@/features/search/hooks/useGetRecentSearch";
import { useSyncRecentSearchMutation } from "@/features/search/hooks/useSyncRecentSearchMutation";
import { RecentSearchParams } from "@/features/search/types/params";
import { RecentSearchItemResponse, RecentSearchSyncItem } from "@/features/search/types/recentSearch";

interface LocalRecentSearchItem extends Omit<RecentSearchItemResponse, "id"> {
  id: string;
}

const INITIAL_RECENT_SEARCH_PARAMS: RecentSearchParams = {
  page: 1,
  size: 10,
};

export function useRecentSearch() {
  const { user } = useUserStore();
  const storage = useAsyncStorage(ASYNC_STORAGE.RECENT_SEARCH);
  const { data: recentSearches } = useGetRecentSearch(INITIAL_RECENT_SEARCH_PARAMS, !!user);
  const [localRecentSearches, setLocalRecentSearches] = useState<Array<LocalRecentSearchItem>>([]);
  const { mutateAsync: createMutateAsync } = useCreateRecentSearchMutation();
  const { mutateAsync: createShowroomMutateAsync } = useCreateRecentShowroomMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteRecentSearchMutation();
  const { mutateAsync: deleteAllMutateAsync } = useDeleteAllRecentSearchMutation();
  const { mutateAsync: syncMutateAsync } = useSyncRecentSearchMutation();
  const isMounted = useRef(false);

  // 로컬 검색어 <-> 서버 겅색어 동기화
  const sync = useCallback(async () => {
    if (user && localRecentSearches.length > 0) {
      const data: Array<RecentSearchSyncItem> = localRecentSearches.map(item => ({
        keyword: item.term,
        createdAt: item.createdAt,
      }));

      setLocalRecentSearches([]);
      await storage.setItem(JSON.stringify([]));
      await syncMutateAsync({ keywords: data });
    }
  }, [localRecentSearches, storage, syncMutateAsync, user]);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    storage.getItem().then(raw => {
      if (raw) {
        try {
          setLocalRecentSearches(JSON.parse(raw) as Array<LocalRecentSearchItem>);
        } catch {
          setLocalRecentSearches([]);
        } finally {
          isMounted.current = true;
        }
      }
    });
  }, [storage]);

  const data = useMemo(() => {
    const server = recentSearches?.content ?? [];
    const merged = [...server, ...localRecentSearches];

    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [recentSearches?.content, localRecentSearches]);

  const createLocalRecentSearch = useCallback(
    async (keyword: string) => {
      const data: LocalRecentSearchItem = {
        createdAt: new Date().toISOString(),
        // 비로그인 기록은 기기에만 남아 쇼룸을 식별할 수 없다 — 항상 검색어 행이다
        type: "TERM",
        term: keyword,
        showroom: null,
        id: randomUUID(),
      };

      const newItems = [...localRecentSearches, data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLocalRecentSearches(newItems);

      await storage.setItem(JSON.stringify(newItems));
    },
    [localRecentSearches, storage]
  );

  const deleteLocalRecentSearch = useCallback(
    async (id: string) => {
      const recentSearches = await storage.getItem();

      if (!recentSearches) {
        return;
      }
      const parsedRecentSearches = JSON.parse(recentSearches) as Array<LocalRecentSearchItem>;
      const filteredRecentSearches = parsedRecentSearches.filter(
        (item: LocalRecentSearchItem) => item.id !== id
      );

      setLocalRecentSearches(filteredRecentSearches);

      await storage.setItem(JSON.stringify(filteredRecentSearches));
    },
    [storage]
  );

  const create = useCallback(
    async (keyword: string) => {
      if (user) {
        await createMutateAsync(keyword);
        return;
      }
      await createLocalRecentSearch(keyword);
    },
    [createLocalRecentSearch, createMutateAsync, user]
  );

  /**
   * 쇼룸 기록 — 검색 결과에서 쇼룸으로 들어갔을 때 남긴다.
   *
   * 비로그인은 남기지 않는다. 기기에 저장해 봐야 쇼룸 이름·프로필을 함께 들고 있지 않아
   * 아바타 행을 그릴 수 없고, 로그인 후 동기화(`sync`)도 검색어만 받는다.
   */
  const createShowroom = useCallback(
    async (showroomId: number) => {
      if (!user) {
        return;
      }
      await createShowroomMutateAsync(showroomId);
    },
    [createShowroomMutateAsync, user]
  );

  const remove = useCallback(
    async (id: string | number) => {
      if (user) {
        await deleteMutateAsync(id as number);
        return;
      }
      await deleteLocalRecentSearch(id as string);
    },
    [deleteLocalRecentSearch, deleteMutateAsync, user]
  );

  /**
   * 전체 삭제 — 로그인은 서버 한 번, 비로그인은 로컬 저장소를 통째로 비운다.
   *
   * 개별 삭제를 반복하지 않는 이유는 요청 수 때문만이 아니다. 로컬 삭제는
   * `getItem` → filter → `setItem`이라, 여러 번을 동시에 돌리면 서로의 결과를 덮어써
   * **일부만 지워진다.**
   */
  const removeAll = useCallback(async () => {
    if (user) {
      await deleteAllMutateAsync();
      return;
    }
    setLocalRecentSearches([]);
    await storage.setItem(JSON.stringify([]));
  }, [deleteAllMutateAsync, storage, user]);

  return { data, create, createShowroom, remove, removeAll, sync };
}
