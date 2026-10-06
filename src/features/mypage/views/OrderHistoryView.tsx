import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { HOME_ROUTES, useMypageNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import OrderItemCard from "@/features/order/components/OrderItemCard/OrderItemCard";
import { Band } from "@/features/order/components/OrderParts/OrderParts";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { useGetOrderList } from "@/features/order/hooks/useOrderQueries";
import { OrderCard } from "@/features/order/types/order";
import { formatOrderDate } from "@/features/order/utils/orderFormat";

/**
 * C10 주문 내역.
 *
 * **항목(옵션) 단위 행**이 주문일·주문번호 그룹 아래로 쌓인다 — 취소·반품·교환이 항목 단위라
 * 한 행에 두 항목을 묶으면 "어느 것을 반품하는지"가 목록에서 사라진다. 그룹 사이는 5px 밴드
 * (C8 장바구니의 쇼룸 그룹과 같은 문법).
 *
 * 그룹 머리는 날짜 + 주문번호 + [주문 상세]로 C10-1 상단과 같은 형식이다 — 상세·배송 조회·1:1
 * 문의가 모두 이 번호로 대화하므로 표기가 어긋나면 같은 주문인지 확인하는 단계가 생긴다.
 *
 * 필터를 두지 않는다 — 최근 6개월 개인 주문은 스크롤로 다 훑는 편이 빠르다.
 */
export default function OrderHistoryView() {
  const navigation = useMypageNavigation();
  const { navigate: navigateTab } = useBottomTab();
  const { open, handleItemAction, openCancelDetail } = useOrderNavigation();
  const { content, isLoading, isRefetching, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetOrderList();

  // 상세에서 취소·반품을 하고 돌아오면 상태가 바뀌어 있다
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const handlePressBrowse = useCallback(() => {
    navigation.goBack();
    navigateTab(HOME_ROUTES.HOME);
  }, [navigateTab, navigation]);

  const renderItem = useCallback(
    ({ item: order }: { item: OrderCard }) => (
      <View>
        <View
          className="flex-row items-center justify-between px-14"
          style={{ paddingTop: 16, paddingBottom: 10, gap: 10 }}
        >
          <View className="min-w-0">
            <Typography style={{ fontSize: 14, fontWeight: "700", lineHeight: 18.2 }} className="text-ink">
              {formatOrderDate(order.orderedAt)}
            </Typography>
            <Typography
              style={{ fontSize: 11.5, lineHeight: 15, marginTop: 4 }}
              className="text-gray45"
              numberOfLines={1}
            >
              주문번호 {order.orderNumber}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => open(COMMON_ROUTES.ORDER_DETAIL, { orderId: order.orderId })}
            activeOpacity={0.5}
            className="flex-row items-center"
            style={{ gap: 2, paddingVertical: 15, paddingLeft: 12, marginVertical: -15 }}
          >
            <Typography
              style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 12.5 }}
              className="text-gray45"
            >
              주문 상세
            </Typography>
            <ChevronRightIcon size={14} />
          </TouchableOpacity>
        </View>

        {order.items.map((row, ix) => (
          <OrderItemCard
            key={row.orderProductId}
            item={row}
            variant="list"
            isFirst={ix === 0}
            onPressAction={action => handleItemAction(order.orderId, row, action)}
            onPressClaim={claimId => open(COMMON_ROUTES.CLAIM_DETAIL, { claimId })}
            onPressCancelRejection={openCancelDetail}
          />
        ))}
        <Band />
      </View>
    ),
    [handleItemAction, open, openCancelDetail]
  );

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="주문 내역" onPressBack={navigation.goBack} />

      <FlatList
        data={content}
        keyExtractor={order => String(order.orderId)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <ListFooter
            isEmpty={content.length === 0}
            isFetching={isFetchingNextPage}
            hasNext={!!hasNextPage}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Spinner />
            </View>
          ) : (
            <EmptyState
              fill
              icon={
                <Svg width={50} height={50} viewBox="0 0 24 24" fill="none">
                  <Path d="M6 4.5h9l3.5 3.5v11.5h-12.5z" stroke="#D8D8DA" strokeWidth={1.2} />
                  <Path d="M9 12.5h6" stroke="#D8D8DA" strokeWidth={1.2} />
                  <Path d="M9 16h4" stroke="#D8D8DA" strokeWidth={1.2} />
                </Svg>
              }
              title="아직 주문 내역이 없어요"
              description="마음에 드는 공구를 찾아보세요"
              actionLabel="공구 구경하기"
              onPressAction={handlePressBrowse}
            />
          )
        }
      />
    </View>
  );
}

/** 다음 페이지를 받는 중이면 스피너, 끝이면 「최근 6개월」 안내 — 마지막 페이지 하단 고정 문구 */
function ListFooter(props: { isEmpty: boolean; isFetching: boolean; hasNext: boolean }) {
  const { isEmpty, isFetching, hasNext } = props;

  if (isEmpty) {
    return null;
  }
  if (isFetching) {
    return (
      <View className="items-center py-24">
        <Spinner />
      </View>
    );
  }
  if (hasNext) {
    return null;
  }
  return (
    <Typography style={{ fontSize: 12, lineHeight: 20.4 }} className="px-14 py-24 text-center text-gray45">
      최근 6개월 주문까지 보여드려요
    </Typography>
  );
}
