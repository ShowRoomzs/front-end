import { useCallback, useEffect } from "react";
import { View } from "react-native";

import NoticeListHeader from "../components/NoticeListHeader/NoticeListHeader";
import NoticeListItem from "../components/NoticeListItem/NoticeListItem";
import useGetNoticeList from "../hooks/useGetNoticeList";
import { NoticeListItem as NoticeItemType } from "../types/notice";

import Divider from "@/common/components/Divider/Divider";
import PagingList from "@/common/components/PagingList/PagingList";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";

export default function NoticeListView() {
  const navigation = useMypageNavigation();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();
  const { notices, pageInfo, isFetching, fetchNextPage } = useGetNoticeList();

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handlePressItem = useCallback(
    (id: number) => {
      navigation.navigate(MYPAGE_ROUTES.NOTICE_DETAIL, { noticeId: id });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: NoticeItemType }) => {
      return <NoticeListItem item={item} onPress={handlePressItem} />;
    },
    [handlePressItem]
  );

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  return (
    <View className="flex-1 bg-white">
      <NoticeListHeader onPressBack={handlePressBack} wrapperClassName="px-20" />
      <PagingList<NoticeItemType>
        data={notices}
        pageInfo={pageInfo}
        isLoading={isFetching}
        onLoadMore={handleLoadMore}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider height={1} wrapperClassName="bg-gray2" />}
      />
    </View>
  );
}
