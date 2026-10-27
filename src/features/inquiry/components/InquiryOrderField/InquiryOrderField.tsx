import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckIcon, ChevronRightIcon, CloseIcon, EmptyBagIcon } from "@/common/components/DsIcon/icons";
import FieldLabel from "@/common/components/FieldLabel/FieldLabel";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { Thumb } from "@/features/order/components/OrderParts/OrderParts";
import { useGetOrderList } from "@/features/order/hooks/useOrderQueries";
import { OrderCard } from "@/features/order/types/order";

/**
 * C12 문의 작성의 [관련 주문 (선택)].
 *
 * 필드를 누르면 **최근 6개월 주문**을 고르는 시트가 열린다(`GET /v1/user/orders`). 행은 주문번호 ·
 * 주문일 한 줄을 머리에 두고 그 아래 썸네일 + 브랜드 · 상품명 · 옵션을 놓는다 — 같은 상품을 여러 번
 * 주문했을 때 주문번호 · 날짜 없이는 구별할 수 없다. 하단 [주문 없이 문의하기]로 선택을 강제하지 않는다.
 *
 * 고른 주문은 요약 카드로 바뀌고 X로 연결을 푼다. 주문 상세에서 열었으면(`locked`) 그 주문이
 * 이미 정해져 있어 X를 두지 않는다.
 */
export interface InquiryOrderSelection {
  orderId: number;
  orderNumber: string;
  /** 「2026.08.03」 — 없으면(주문 상세에서 번호만 넘겨받은 경우) 번호만 적는다 */
  dateLabel: string | null;
  productName: string | null;
  /** 브랜드 · 옵션 */
  subLabel: string | null;
  thumbnailUrl: string | null;
}

interface InquiryOrderFieldProps {
  selected: InquiryOrderSelection | null;
  locked?: boolean;
  onChange: (selection: InquiryOrderSelection | null) => void;
}

const ORDER_SHEET_ID = "inquiry-order";
const MIN_BOTTOM_PADDING = 20;
const RECENT_MONTHS = 6;

/** 2026-08-03T… → 2026.08.03 */
export function formatInquiryOrderDate(value: string | null | undefined) {
  return value ? value.slice(0, 10).replace(/-/g, ".") : null;
}

/** 주문 한 건을 시트 행 · 요약 카드로 — 상품이 여럿이면 첫 상품에 `외 N건`을 붙인다 */
export function toInquiryOrderSelection(order: OrderCard): InquiryOrderSelection {
  const [first] = order.items;
  const rest = order.items.length - 1;

  return {
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    dateLabel: formatInquiryOrderDate(order.orderedAt),
    productName: first ? `${first.productName}${rest > 0 ? ` 외 ${rest}건` : ""}` : null,
    subLabel: first ? [first.brandName, first.optionName].filter(Boolean).join(" · ") || null : null,
    thumbnailUrl: first?.thumbnailUrl ?? null,
  };
}

export default function InquiryOrderField(props: InquiryOrderFieldProps) {
  const { selected, locked = false, onChange } = props;
  const { close } = useBottomSheetContext();

  /** 시트 props가 렌더마다 바뀌면 useBottomSheet가 다시 등록해 렌더가 끝없이 돈다 — 함수를 고정한다 */
  const handleSelect = useCallback(
    (selection: InquiryOrderSelection | null) => {
      onChange(selection);
      close();
    },
    [close, onChange]
  );

  const { open } = useBottomSheet({
    id: ORDER_SHEET_ID,
    render: <InquiryOrderSheet selectedOrderId={selected?.orderId} onSelect={handleSelect} />,
    // 목록 스크롤과 시트 끌기가 겹치지 않도록 시트는 손잡이로만 끈다(상품 옵션 시트와 같다)
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined, enableContentPanningGesture: false },
  });

  return (
    <View>
      <FieldLabel label="관련 주문" optional />

      {selected ? (
        <View
          className="flex-row items-center rounded-base border-[1px] border-borderButton"
          style={{ marginTop: 9, padding: 12, gap: 12 }}
        >
          {/* 문의 맥락에선 보조 정보라 시트(64)보다 작게 둔다 */}
          {selected.thumbnailUrl !== null && <Thumb uri={selected.thumbnailUrl} size={56} />}
          <View className="min-w-0 flex-1">
            <Typography style={{ fontSize: 11.5, lineHeight: 15.5 }} className="text-gray45">
              {selected.dateLabel
                ? `${selected.orderNumber} · ${selected.dateLabel}`
                : `주문번호 ${selected.orderNumber}`}
            </Typography>
            {!!selected.productName && (
              <Typography
                numberOfLines={1}
                style={{ fontSize: 13.5, lineHeight: 18.9, marginTop: 4 }}
                className="text-ink80"
              >
                {selected.productName}
              </Typography>
            )}
            {!!selected.subLabel && (
              <Typography
                numberOfLines={1}
                style={{ fontSize: 11.5, lineHeight: 15.5, marginTop: 3 }}
                className="text-gray45"
              >
                {selected.subLabel}
              </Typography>
            )}
          </View>
          {!locked && (
            <TouchableOpacity
              onPress={() => onChange(null)}
              activeOpacity={0.4}
              className="items-center justify-center"
              style={{ width: 44, height: 44, marginRight: -10, marginVertical: -12 }}
            >
              <CloseIcon size={14} color="#8E8E8E" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={open}
          activeOpacity={0.6}
          className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
          style={{ marginTop: 9 }}
        >
          <Typography style={{ fontSize: 15, lineHeight: 15 }} className="text-gray71">
            주문 내역에서 선택
          </Typography>
          <ChevronRightIcon size={15} color="#C7C7C7" />
        </TouchableOpacity>
      )}

      <Typography style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 8 }} className="text-gray45">
        주문을 연결하면 배송·환불 확인이 더 빨라요
      </Typography>
    </View>
  );
}

interface InquiryOrderSheetProps {
  selectedOrderId?: number;
  onSelect: (selection: InquiryOrderSelection | null) => void;
}

/** 6개월 전 날짜 — `orderedAt` 앞 10자리와 문자열로 비교한다(서버 시각을 기기 시간대로 바꾸지 않는다) */
function getCutoffDate() {
  const date = new Date();

  date.setMonth(date.getMonth() - RECENT_MONTHS);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function InquiryOrderSheet(props: InquiryOrderSheetProps) {
  const { selectedOrderId, onSelect } = props;
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { content, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetOrderList();

  const cutoff = useMemo(getCutoffDate, []);
  const orders = useMemo(
    () => content.filter(order => order.orderedAt.slice(0, 10) >= cutoff),
    [content, cutoff]
  );

  /**
   * 목록은 최신순이라 마지막 주문이 6개월 안이면 다음 쪽에도 있을 수 있다 — 기준 밖으로 나갈 때까지
   * 이어 받는다. 시트 안에서 끝까지 스크롤해야 나오는 구조로 두면 6개월 경계가 어디인지 알 수 없다.
   */
  const lastOrderedAt = content.at(-1)?.orderedAt;

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && lastOrderedAt && lastOrderedAt.slice(0, 10) >= cutoff) {
      void fetchNextPage();
    }
  }, [cutoff, fetchNextPage, hasNextPage, isFetchingNextPage, lastOrderedAt]);

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, MIN_BOTTOM_PADDING) }}>
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
        className="px-20 pb-6 text-center text-ink"
      >
        관련 주문 선택
      </Typography>
      <Typography style={{ fontSize: 12, lineHeight: 19.2 }} className="px-20 pb-14 text-center text-gray45">
        최근 6개월 주문만 보여드려요
      </Typography>

      {isLoading && (
        <View className="items-center" style={{ paddingVertical: 40 }}>
          <Spinner />
        </View>
      )}

      {!isLoading && orders.length === 0 && (
        <View className="items-center px-20" style={{ paddingTop: 10, paddingBottom: 24 }}>
          <EmptyBagIcon size={50} />
          <Typography
            style={{ fontSize: 15, fontWeight: "600", lineHeight: 22.5, marginTop: 16 }}
            className="text-center text-ink"
          >
            최근 6개월 주문이 없어요
          </Typography>
        </View>
      )}

      {/*
        BottomSheetScrollView는 자기 스크롤 높이를 시트 높이로 덮어써서 아래 [주문 없이 문의하기]가 잘린다 —
        시트 높이는 바깥 BottomSheetView만 재게 하고 목록은 일반 스크롤로 둔다
      */}
      {orders.length > 0 && (
        <ScrollView style={{ maxHeight: height * 0.55 }} contentContainerStyle={{ paddingBottom: 8 }}>
          {orders.map((order, ix) => {
            const selection = toInquiryOrderSelection(order);
            const isSelected = order.orderId === selectedOrderId;

            return (
              <TouchableOpacity
                key={order.orderId}
                onPress={() => onSelect(selection)}
                activeOpacity={0.7}
                className={`px-20 ${isSelected ? "bg-roseTint" : "bg-white"} ${ix > 0 ? "border-t-[0.5px] border-dividerProduct" : ""}`}
                style={{ paddingVertical: 14 }}
              >
                <View className="flex-row items-baseline" style={{ gap: 8 }}>
                  <Typography
                    style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 15.5 }}
                    className="min-w-0 flex-1 text-gray45"
                  >
                    {selection.orderNumber}
                  </Typography>
                  <Typography style={{ fontSize: 11.5, lineHeight: 15.5 }} className="text-gray45">
                    {selection.dateLabel}
                  </Typography>
                </View>
                <View className="flex-row items-center" style={{ gap: 12, marginTop: 10 }}>
                  <Thumb uri={selection.thumbnailUrl} size={64} />
                  <View className="min-w-0 flex-1">
                    {!!order.items[0]?.brandName && (
                      <Typography style={{ fontSize: 11.5, lineHeight: 15.5 }} className="text-gray45">
                        {order.items[0].brandName}
                      </Typography>
                    )}
                    <Typography
                      numberOfLines={2}
                      style={{ fontSize: 14, fontWeight: "500", lineHeight: 19.6, marginTop: 3 }}
                      className="text-ink"
                    >
                      {selection.productName}
                    </Typography>
                    {!!order.items[0]?.optionName && (
                      <Typography
                        style={{ fontSize: 12.5, lineHeight: 17.5, marginTop: 4 }}
                        className="text-gray45"
                      >
                        {order.items[0].optionName}
                      </Typography>
                    )}
                  </View>
                  <CheckIcon style={{ opacity: isSelected ? 1 : 0 }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View className="border-t-[0.5px] border-divider px-20 pt-14">
        <TouchableOpacity
          onPress={() => onSelect(null)}
          activeOpacity={0.6}
          className="h-48 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-ink76">
            주문 없이 문의하기
          </Typography>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
}
