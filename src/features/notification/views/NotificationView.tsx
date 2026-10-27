import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Linking, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Avatar from "@/common/components/Avatar/Avatar";
import ComingSoonView from "@/common/components/ComingSoon/ComingSoonView";
import DevMockSwitch from "@/common/components/DevMockSwitch/DevMockSwitch";
import { BellIcon, SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { queryClient } from "@/common/lib/queryClient";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, HOME_ROUTES, MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { SUSPENSION_SHEET_ID } from "@/features/account/constants/suspension";
import { NOTIFICATION_BADGE_QUERY_KEY } from "@/features/notification/hooks/useNotificationBadge";
import { notificationService } from "@/features/notification/services/notificationService";
import { NotificationItem, NotificationListResponse } from "@/features/notification/types/notification";
import { Thumb } from "@/features/order/components/OrderParts/OrderParts";
import { useGetNotificationSettings } from "@/features/setting/hooks/useGetNotificationSettings";

/**
 * C11 알림 — C1 홈 상단 종에서만 들어온다. 단일 목록 + 날짜 구분(오늘 · 최근 7일 · 이전), 90일 보관, 필터 없음.
 *
 * - 앞 이미지 3종: 주문 · 배송 · 반품은 상품 썸네일(R4), 쇼룸 소식은 아바타(진행 중 공구면 로즈 링),
 *   문의 답변 · 약관 같은 계정 · 서비스는 회색 아이콘. 문장에서 대상(`emphasis`)만 굵게 둔다.
 * - 할 일(회수 송장 · 재발송비)은 주문 내역과 같은 로즈 한 줄 + 기한.
 * - 광고성은 시간 앞에 「광고」. 광고 수신에 동의하지 않았으면 광고성 행을 빼고 동의 안내를 위에 둔다.
 * - 탭하면 읽음 처리하고 대상 화면으로 간다. 목록에 들어오면 종 배지만 초기화한다.
 *
 * ⚠️ 알림 API는 back-end main(2026-10-24)에 있지만 개발 서버에 없다 — 404면 「준비 중」을 그린다.
 * 기기 알림 꺼짐 안내는 푸시 연동(기기 권한 확인) 전이라 DEV 목업에서만 보인다.
 */
const NOTIFICATION_QUERY_KEY = "notifications";

type DevNotificationMock = "OFF" | "LIST" | "EMPTY" | "OS_OFF" | "AD_OFF";

const DEV_NOTIFICATION_OPTIONS: Array<{ value: DevNotificationMock; label: string }> = [
  { value: "OFF", label: "실제" },
  { value: "LIST", label: "목록" },
  { value: "EMPTY", label: "빈 상태" },
  { value: "OS_OFF", label: "기기 알림 꺼짐" },
  { value: "AD_OFF", label: "광고 미동의" },
];

const EMPTY_PAGE: NotificationListResponse = {
  content: [],
  pageInfo: { currentPage: 1, totalPages: 0, totalResults: 0, limit: 20, hasNext: false },
};

/** 10분 전 · 1시간 전 · 2일 전 · 그보다 오래면 10.01 */
function formatNotificationTime(value: string) {
  const target = dayjs(value);
  const now = dayjs();
  const minutes = now.diff(target, "minute");

  if (minutes < 1) {
    return "방금";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = now.diff(target, "hour");

  if (hours < 24) {
    return `${hours}시간 전`;
  }
  const days = now.startOf("day").diff(target.startOf("day"), "day");

  return days < 7 ? `${days}일 전` : target.format("MM.DD");
}

function groupLabel(value: string) {
  const days = dayjs().startOf("day").diff(dayjs(value).startOf("day"), "day");

  if (days <= 0) {
    return "오늘";
  }
  return days < 7 ? "최근 7일" : "이전";
}

type Row =
  | { kind: "header"; key: string; label: string }
  | { kind: "item"; key: string; item: NotificationItem };

export default function NotificationView() {
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { open: openSheet } = useBottomSheetContext();
  const [devMock, setDevMock] = useState<DevNotificationMock>("OFF");
  const [readIds, setReadIds] = useState<Array<number>>([]);
  const { data: settings } = useGetNotificationSettings();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [NOTIFICATION_QUERY_KEY, devMock],
    queryFn: async ({ pageParam }) => {
      if (__DEV__ && devMock !== "OFF") {
        if (devMock === "EMPTY") {
          return EMPTY_PAGE;
        }
        const { buildNotificationMock } = await import("@/features/notification/mocks/notificationMock");

        return buildNotificationMock();
      }
      return notificationService.getList(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage?.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const { mutate: markRead } = useMutation({ mutationFn: notificationService.markRead });

  // 목록에 들어오면 종 배지만 초기화한다 — 각 알림의 읽음(로즈 점)은 탭할 때 따로 처리한다
  useEffect(() => {
    void notificationService
      .seeBadge()
      .then(() => queryClient.setQueryData([NOTIFICATION_BADGE_QUERY_KEY], 0))
      .catch(() => undefined);
  }, []);

  const isUnavailable = !!data && data.pages[0] === null;
  const isAdAgreed = devMock === "AD_OFF" ? false : (settings?.marketingAgree ?? true);
  const isOsOff = __DEV__ && devMock === "OS_OFF";

  const rows = useMemo(() => {
    const items = (data?.pages ?? [])
      .flatMap(page => page?.content ?? [])
      .filter(item => isAdAgreed || !item.advertising);
    const result: Array<Row> = [];

    let lastLabel = "";

    items.forEach(item => {
      const label = groupLabel(item.createdAt);

      if (label !== lastLabel) {
        result.push({ kind: "header", key: `h-${label}`, label });
        lastLabel = label;
      }
      result.push({ kind: "item", key: `n-${item.notificationId}`, item });
    });
    return result;
  }, [data, isAdAgreed]);

  const goMypage = (screen: string, params?: object) =>
    mainNavigation.navigate(ROOT_ROUTES.HOME, {
      screen: HOME_ROUTES.MYPAGE,
      params: { screen, params } as never,
    });

  /** 대상 화면으로 — 갈 곳이 없거나 앱이 아직 모르는 대상이면 읽음만 처리한다 */
  const handlePress = (item: NotificationItem) => {
    if (!item.read && !readIds.includes(item.notificationId)) {
      setReadIds(previous => [...previous, item.notificationId]);
      if (devMock === "OFF") {
        markRead(item.notificationId);
      }
    }
    const { type, id, sub } = item.target;

    switch (type) {
      case "CLAIM":
        return id && navigation.navigate(COMMON_ROUTES.CLAIM_DETAIL, { claimId: id });
      case "POST":
        return id && navigation.navigate(COMMON_ROUTES.POST_DETAIL, { postId: id });
      // 쇼룸 대상 id는 크리에이터 id다 — 쇼룸 상세 경로가 같은 id를 쓴다
      case "SHOWROOM":
        return id && navigation.navigate(COMMON_ROUTES.SHOWROOM_DETAIL, { showroomId: id });
      case "PRODUCT":
        return id && navigation.navigate(COMMON_ROUTES.PRODUCT_DETAIL, { productId: id });
      case "INQUIRY":
        return sub === "PRODUCT"
          ? goMypage(MYPAGE_ROUTES.INQUIRY_HISTORY)
          : id && goMypage(MYPAGE_ROUTES.INQUIRY_DETAIL, { inquiryId: id });
      // 하위주문(배송 그룹) id로는 주문 상세를 열 수 없다 — 주문 내역으로 보낸다
      case "ORDER_GROUP":
        return goMypage(MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH);
      case "SETTINGS":
        return goMypage(MYPAGE_ROUTES.SETTINGS);
      case "ACCOUNT_STATUS":
        return openSheet(SUSPENSION_SHEET_ID);
      default:
        return undefined;
    }
  };

  if (isUnavailable && devMock === "OFF") {
    return (
      <View className="flex-1 bg-white">
        <ComingSoonView
          title="알림"
          description="공구 소식과 주문 알림을 여기로 모으고 있어요."
          onPressBack={navigation.goBack}
        />
        <DevMockSwitch
          label="DEV 알림"
          options={DEV_NOTIFICATION_OPTIONS}
          current={devMock}
          onPick={setDevMock}
        />
      </View>
    );
  }

  const renderRow = ({ item: row }: { item: Row }) => {
    if (row.kind === "header") {
      return (
        <Typography
          style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
          className="px-14 pb-4 pt-18 text-gray55"
        >
          {row.label}
        </Typography>
      );
    }
    return (
      <NotificationRow
        item={row.item}
        isUnread={!row.item.read && !readIds.includes(row.item.notificationId)}
        onPress={() => handlePress(row.item)}
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="알림" onPressBack={navigation.goBack} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={row => row.key}
          renderItem={renderRow}
          onEndReached={() => hasNextPage && !isFetchingNextPage && void fetchNextPage()}
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={
            <>
              <DevMockSwitch
                label="DEV 알림"
                options={DEV_NOTIFICATION_OPTIONS}
                current={devMock}
                onPick={setDevMock}
              />
              {isOsOff && (
                <NoticeBar
                  text="기기 알림이 꺼져 있어 주문 · 배송 소식을 놓칠 수 있어요"
                  action="설정 열기"
                  onPress={() => void Linking.openSettings()}
                />
              )}
              {!isAdAgreed && (
                <NoticeBar
                  text="팔로우한 쇼룸의 새 공구 알림은 광고성 정보 수신에 동의해야 받을 수 있어요"
                  action="동의하기"
                  onPress={() => goMypage(MYPAGE_ROUTES.SETTINGS)}
                />
              )}
            </>
          }
          ListEmptyComponent={
            <EmptyState
              fill
              icon={<BellIcon size={50} color="#D8D8DA" />}
              title="아직 받은 알림이 없어요"
              description={"주문 · 배송 소식과 팔로우한 쇼룸의\n새 공구를 여기서 알려드려요"}
            />
          }
          ListFooterComponent={
            rows.length > 0 ? (
              <Typography
                style={{ fontSize: 12, lineHeight: 20.4 }}
                className="px-14 pb-30 pt-22 text-center text-gray45"
              >
                최근 90일 알림까지 보여드려요
              </Typography>
            ) : null
          }
        />
      )}
    </View>
  );
}

function NoticeBar(props: { text: string; action: string; onPress: () => void }) {
  return (
    <View
      className="mx-14 flex-row items-center rounded-base bg-band"
      style={{ marginTop: 12, paddingVertical: 12, paddingHorizontal: 13, gap: 10 }}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15zM10 20.5h4"
          stroke="#737373"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </Svg>
      <Typography style={{ fontSize: 12.5, lineHeight: 19.4 }} className="min-w-0 flex-1 text-ink76">
        {props.text}
      </Typography>
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.6}
        style={{ paddingVertical: 12, marginVertical: -12 }}
      >
        <Typography
          style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5, textDecorationLine: "underline" }}
          className="text-ink76"
        >
          {props.action}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

function NotificationRow(props: { item: NotificationItem; isUnread: boolean; onPress: () => void }) {
  const { item, isUnread, onPress } = props;
  const emphasisAt = item.emphasis ? item.title.indexOf(item.emphasis) : -1;
  const before = emphasisAt >= 0 ? item.title.slice(0, emphasisAt) : item.title;
  const after = emphasisAt >= 0 ? item.title.slice(emphasisAt + (item.emphasis?.length ?? 0)) : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-start px-14"
      style={{ gap: 12, paddingVertical: 12 }}
    >
      {item.imageKind === "AVATAR" && (
        <Avatar imageUrl={item.imageUrl} size={44} hasOngoingGroupBuy={item.liveGroupBuy} />
      )}
      {item.imageKind === "THUMB" && <Thumb uri={item.imageUrl} size={44} />}
      {(item.imageKind === "ICON" || !item.imageKind) && (
        <View className="items-center justify-center rounded-full bg-fill" style={{ width: 44, height: 44 }}>
          <SpeechBubbleIcon size={21} color="#737373" />
        </View>
      )}

      <View className="min-w-0 flex-1" style={{ paddingTop: 1 }}>
        <Typography style={{ fontSize: 14, lineHeight: 21 }} className="text-ink">
          {before}
          {emphasisAt >= 0 && (
            <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 21 }} className="text-ink">
              {item.emphasis}
            </Typography>
          )}
          {after}
        </Typography>
        {!!item.body && (
          <Typography
            style={{
              fontSize: 12.5,
              fontWeight: item.todoDueAt ? "600" : "400",
              lineHeight: 17.5,
              marginTop: 4,
            }}
            className={item.todoDueAt ? "text-roseText" : "text-gray45"}
          >
            {/*
              할 일 기한은 KST 벽시계(「○일 23:59:59」)인데 서버 직렬화가 `Z`를 붙인다 — UTC로 읽으면 다음 날이 된다.
              날짜 부분을 그대로 쓴다
            */}
            {item.todoDueAt
              ? `${item.body} · ${item.todoDueAt.slice(5, 7)}.${item.todoDueAt.slice(8, 10)}까지`
              : item.body}
          </Typography>
        )}
        <Typography style={{ fontSize: 12, lineHeight: 12, marginTop: 5 }} className="text-gray45">
          {item.advertising
            ? `광고 · ${formatNotificationTime(item.createdAt)}`
            : formatNotificationTime(item.createdAt)}
        </Typography>
      </View>

      <View
        className="rounded-full"
        style={{ width: 7, height: 7, marginTop: 8, backgroundColor: isUnread ? "#F2456E" : "transparent" }}
      />
    </TouchableOpacity>
  );
}
