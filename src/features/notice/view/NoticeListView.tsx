import { useCallback, useEffect } from "react";
import { View } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useMypageNavigation } from "@/common/router";
import NoticeAccordion from "@/features/notice/components/NoticeAccordion/NoticeAccordion";
import useGetNoticeList from "@/features/notice/hooks/useGetNoticeList";
import { NoticeListItem } from "@/features/notice/types/notice";

/**
 * C17 공지사항 — 운영자 게시 정적 콘텐츠.
 *
 * 최신순에 [중요]가 상단 고정이고(정렬은 서버가 한다), 항목을 탭하면 본문이 그 자리에서 펼쳐진다.
 * 목록에서 상세로 넘어가지 않는 이유는 공지가 대개 몇 문단이라, 화면을 옮길 만큼의 내용이 아니어서다.
 */
export default function NoticeListView() {
  const navigation = useMypageNavigation();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();
  const { notices, pageInfo, isFetching, fetchNextPage } = useGetNoticeList();

  const renderItem = useCallback(({ item }: { item: NoticeListItem }) => <NoticeAccordion item={item} />, []);

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="공지사항" onPressBack={navigation.goBack} />
      <PagingList<NoticeListItem>
        data={notices}
        pageInfo={pageInfo}
        isLoading={isFetching}
        onLoadMore={fetchNextPage}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
