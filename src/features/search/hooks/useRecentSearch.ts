import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ASYNC_STORAGE } from "@/common/constants/asyncStorage";
import { useUserStore } from "@/common/stores/useUserStore";
import { useCreateRecentSearchMutation } from "@/features/search/hooks/useCreateRecentSearchMutation";
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
  const { mutateAsync: deleteMutateAsync } = useDeleteRecentSearchMutation();
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
        term: keyword,
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

  return { data, create, remove, sync };
}
