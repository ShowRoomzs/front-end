import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";

import { SearchIcon } from "@/common/components/DsIcon/icons";
import PagingList from "@/common/components/PagingList/PagingList";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import RecentSearchList from "@/features/search/components/RecentSearchList/RecentSearchList";
import SearchField from "@/features/search/components/SearchField/SearchField";
import { useRecentSearch } from "@/features/search/hooks/useRecentSearch";
import ShowroomRow from "@/features/showroom/components/ShowroomRow/ShowroomRow";
import { useGetActiveShowrooms, useSearchShowrooms } from "@/features/showroom/hooks/useSearchShowrooms";
import { ShowroomSearchItem } from "@/features/showroom/types/showroom";

/**
 * C14 쇼룸 검색.
 *
 * 검색 대상은 쇼룸 이름과 아이디(@handle)뿐이다 — 상품 검색·카테고리 탐색은 범위 밖이다.
 * 아이디는 쇼룸 고유값(중복 불가)이라 이름보다 정확한 검색 키이고, 같은 이름의 쇼룸을
 * 아이디로 구별하게 이름 + @handle 2줄로 정리했다.
 *
 * 검색 결과에는 팔로우 버튼을 두지 않는다 — 행 전체가 C4 쇼룸으로 가는 단일 액션이고,
 * 팔로우는 쇼룸을 확인한 뒤 그곳에서 하는 것이 자연스럽다.
 */
export default function SearchView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SEARCH>>();
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();

  const [keyword, setKeyword] = useState(route.params?.keyword ?? "");
  /** 입력 중에는 결과를 그리지 않는다 — 확정한 검색어만 서버로 보낸다 */
  const [submittedKeyword, setSubmittedKeyword] = useState(route.params?.keyword ?? "");

  const { data: recentSearches, create, remove, sync } = useRecentSearch();
  const { content, pageInfo, isLoading, isFetchingNextPage, fetchNextPage } =
    useSearchShowrooms(submittedKeyword);
  const hasNoResult = submittedKeyword.length > 0 && !isLoading && content.length === 0;
  const { data: activeShowrooms } = useGetActiveShowrooms(hasNoResult);

  useEffect(() => {
    // 로컬 검색어 <-> 서버 검색어 동기화
    void sync();
  }, [sync]);

  const handleSearch = useCallback(
    async (nextKeyword: string) => {
      const trimmed = nextKeyword.trim();

      if (!trimmed) {
        return;
      }
      setKeyword(trimmed);
      setSubmittedKeyword(trimmed);
      await create(trimmed);
    },
    [create]
  );

  const handleChangeKeyword = useCallback((next: string) => {
    setKeyword(next);
    if (next.length === 0) {
      setSubmittedKeyword("");
    }
  }, []);

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [mainNavigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ShowroomSearchItem>) => (
      <ShowroomRow
        showroomId={item.showroomId}
        showroomName={item.showroomName}
        showroomImageUrl={item.showroomImageUrl}
        hasOngoingGroupBuy={item.hasOngoingGroupBuy}
        handle={item.showroomAddress}
        keyword={submittedKeyword}
        onPress={handlePressShowroom}
      />
    ),
    [handlePressShowroom, submittedKeyword]
  );

  const renderBody = () => {
    // 입력 전 — 최근 검색만 둔다
    if (submittedKeyword.length === 0) {
      return (
        <View className="flex-1">
          {recentSearches.length > 0 && (
            <View className="flex-row items-center justify-between px-14 pb-4 pt-16">
              <Typography variant="sectionLabel" className="text-gray55">
                최근 검색
              </Typography>
              <TouchableOpacity
                onPress={() => recentSearches.forEach(item => remove(item.id))}
                activeOpacity={0.6}
                style={{ paddingVertical: 10, marginVertical: -10 }}
              >
                <Typography
                  style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
                  className="text-gray45"
                >
                  전체 삭제
                </Typography>
              </TouchableOpacity>
            </View>
          )}
          <RecentSearchList items={recentSearches} onPressKeyword={handleSearch} onDeleteKeyword={remove} />
        </View>
      );
    }

    // 결과 없음 — 검색어를 문구에 그대로 넣어 오타를 스스로 확인하게 하고, 다음 행동을 만든다
    if (hasNoResult) {
      return (
        <View className="flex-1">
          <View className="items-center px-30 pb-24 pt-56">
            <SearchIcon size={32} color="#C7C7C7" />
            <Typography
              style={{ fontSize: 14, fontWeight: "600", lineHeight: 21, marginTop: 14 }}
              className="text-center text-ink"
            >
              {`'${submittedKeyword}' 검색 결과가 없어요`}
            </Typography>
            <Typography
              variant="caption"
              style={{ lineHeight: 20, marginTop: 5 }}
              className="text-center text-gray45"
            >
              쇼룸 이름의 일부만 입력해도 찾을 수 있어요
            </Typography>
          </View>

          {!!activeShowrooms?.length && (
            <>
              <SectionLabel label="이런 쇼룸은 어떠세요" className="pb-4 pt-8" />
              {activeShowrooms.map(showroom => (
                <ShowroomRow
                  key={showroom.showroomId}
                  showroomId={showroom.showroomId}
                  showroomName={showroom.showroomName}
                  showroomImageUrl={showroom.showroomImageUrl}
                  hasOngoingGroupBuy={showroom.hasOngoingGroupBuy}
                  handle={showroom.showroomAddress}
                  onPress={handlePressShowroom}
                />
              ))}
            </>
          )}
        </View>
      );
    }

    return (
      <PagingList
        data={content}
        pageInfo={pageInfo}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={fetchNextPage}
        keyExtractor={item => String(item.showroomId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionLabel
            label={`검색 결과 ${pageInfo?.totalElements ?? content.length}`}
            className="pb-4 pt-16"
          />
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SearchField
        keyword={keyword}
        onChangeKeyword={handleChangeKeyword}
        onSubmit={() => handleSearch(keyword)}
        onPressBack={navigation.goBack}
      />
      {renderBody()}
    </View>
  );
}
