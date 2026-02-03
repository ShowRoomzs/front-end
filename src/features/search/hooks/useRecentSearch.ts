import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { useCallback, useState } from "react";

import { ASYNC_STORAGE } from "@/common/constants/asyncStorage";
import { useUserStore } from "@/common/stores/useUserStore";
import { useCreateRecentSearchMutation } from "@/features/search/hooks/useCreateRecentSearchMutation";
import { useDeleteRecentSearchMutation } from "@/features/search/hooks/useDeleteRecentSearchMutation";
import { useGetRecentSearch } from "@/features/search/hooks/useGetRecentSearch";
import { RecentSearchParams } from "@/features/search/types/params";
import { RecentSearchItemResponse } from "@/features/search/types/recentSearch";

interface LocalRecentSearchItem extends Omit<RecentSearchItemResponse, "id"> {
  id: string;
}

const INITIAL_RECENT_SEARCH_PARAMS: RecentSearchParams = {
  page: 1,
  limit: 10,
};

// TODO : 추후 리팩토링 필요
export function useRecentSearch() {
  const { user } = useUserStore();
  const storage = useAsyncStorage(ASYNC_STORAGE.RECENT_SEARCH);
  const { data: recentSearches } = useGetRecentSearch(INITIAL_RECENT_SEARCH_PARAMS, !!user);
  const [localRecentSearches, setLocalRecentSearches] = useState<Array<LocalRecentSearchItem>>([]);
  const { mutateAsync: createMutateAsync } = useCreateRecentSearchMutation();
  const { mutateAsync: deleteMutateAsync } = useDeleteRecentSearchMutation();

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

  return { data: recentSearches, create, remove };
}
