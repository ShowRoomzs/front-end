import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import AutoCompleteView from "@/features/search/components/AutoCompleteView/AutoCompleteView";
import RecentSearchKeywords from "@/features/search/components/RecentSearchKeywords/RecentSearchKeywords";
import SearchHeader from "@/features/search/components/SearchHeader/SearchHeader";
import { useRecentSearch } from "@/features/search/hooks/useRecentSearch";
import { AutoCompleteItem } from "@/features/search/types/autoComplete";

export default function SearchView() {
  const navigation = useMainNavigation();
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SEARCH>>();
  const initialKeyword = route.params?.keyword;
  const commonNavigation = useCommonNavigation();
  const [keyword, setKeyword] = useState(initialKeyword || "");
  const { data: recentSearches, create, remove, sync } = useRecentSearch();

  useEffect(() => {
    // 로컬 검색어 <-> 서버 겅색어 동기화
    sync();
  }, [sync]);

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
    (keyword: string | AutoCompleteItem) => {
      if (typeof keyword === "string") {
        handleSearch(keyword);
        return;
      }
      handleSearch(keyword.name);
    },
    [handleSearch]
  );

  const handleDeleteKeyword = useCallback(
    (keywordId: string | number) => {
      remove(keywordId);
    },
    [remove]
  );

  const handleChangeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SearchHeader
        onPressBack={handlePressBack}
        wrapperClassName="px-20"
        onSearch={handleSearch}
        keyword={keyword}
        onChangeKeyword={handleChangeKeyword}
      />
      {keyword.length > 0 ? (
        <AutoCompleteView keyword={keyword} onPressKeyword={handlePressKeyword} />
      ) : (
        <RecentSearchKeywords
          onPressKeyword={handlePressKeyword}
          onDeleteKeyword={handleDeleteKeyword}
          keywords={recentSearches ?? []}
          wrapperClassName="mt-20"
        />
      )}
    </View>
  );
}
