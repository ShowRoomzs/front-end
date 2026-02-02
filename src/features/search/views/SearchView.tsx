import { useCallback } from "react";
import { View } from "react-native";

import { useMainNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import SearchHeader from "@/features/search/components/SearchHeader/SearchHeader";
import { useGetRecentSearch } from "@/features/search/hooks/useGetRecentSearch";
import { RecentSearchParams } from "@/features/search/types/params";

const INITIAL_RECENT_SEARCH_PARAMS: RecentSearchParams = {
  page: 1,
  limit: 10,
};

export default function SearchView() {
  const navigation = useMainNavigation();
  const { user } = useUserStore();
  // 추후 필요 시 useParams로 파라미터 관리
  const { data: recentSearchKeywords } = useGetRecentSearch(INITIAL_RECENT_SEARCH_PARAMS, !!user);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback((keyword: string) => {
    console.log(keyword);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SearchHeader onPressBack={handlePressBack} wrapperClassName="px-20" onSearch={handleSearch} />
      {/* <RecentSearchKeywords keywords={recentSearchKeywords || []} /> */}
    </View>
  );
}
