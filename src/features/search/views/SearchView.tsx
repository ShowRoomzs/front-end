import { useCallback } from "react";
import { View } from "react-native";

import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import RecentSearchKeywords from "@/features/search/components/RecentSearchKeywords/RecentSearchKeywords";
import SearchHeader from "@/features/search/components/SearchHeader/SearchHeader";
import { useRecentSearch } from "@/features/search/hooks/useRecentSearch";

export default function SearchView() {
  const navigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();
  // 추후 필요 시 useParams로 파라미터 관리
  const { data: recentSearches, create, remove } = useRecentSearch();

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      // 순서 최신화 위함
      await create(keyword);
      commonNavigation.navigate(COMMON_ROUTES.SEARCH_DETAIL, { keyword });
    },
    [commonNavigation, create]
  );

  const handlePressKeyword = useCallback(
    (keyword: string) => {
      handleSearch(keyword);
    },
    [handleSearch]
  );

  const handleDeleteKeyword = useCallback(
    (keywordId: string | number) => {
      remove(keywordId);
    },
    [remove]
  );

  return (
    <View className="flex-1 bg-white">
      <SearchHeader onPressBack={handlePressBack} wrapperClassName="px-20" onSearch={handleSearch} />
      {/* TODO : 검색어 입력 시 자동완성 view 추가 */}
      <RecentSearchKeywords
        onPressKeyword={handlePressKeyword}
        onDeleteKeyword={handleDeleteKeyword}
        keywords={recentSearches?.data || []}
        wrapperClassName="mt-20"
      />
    </View>
  );
}
