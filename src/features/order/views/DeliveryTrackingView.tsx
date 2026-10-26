import { RouteProp, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import Accordion from "@/common/components/Accordion/Accordion";
import DevMockSwitch from "@/common/components/DevMockSwitch/DevMockSwitch";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { queryClient } from "@/common/lib/queryClient";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  Band,
  BottomSafeSpacer,
  NoticeBox,
  ProductLine,
  SectionTitle,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import {
  CarrierButtons,
  CarrierRows,
  DisclaimerLine,
  KeyValueRow,
  StageBar,
  Timeline,
  ToggleRowsButton,
  TrackingHeadline,
  useCollapsibleRows,
} from "@/features/order/components/TrackingParts/TrackingParts";
import TrackingStallBlock from "@/features/order/components/TrackingStallBlock/TrackingStallBlock";
import { ORDER_QUERY_KEY } from "@/features/order/constants/queryKey";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { useGetOrderDetail, useGetTracking } from "@/features/order/hooks/useOrderQueries";
import { orderService } from "@/features/order/services/orderService";
import { StallChoice, StallChoiceResponse } from "@/features/order/types/order";
import {
  formatDeadline,
  formatMonthDayWeekday,
  formatOrderDate,
  formatScanTime,
  formatShortMonthDayWeekday,
  optionWithQuantity,
  resolveErrorMessage,
  won,
} from "@/features/order/utils/orderFormat";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";

/**
 * C10-2 배송 조회 — **주문이 아니라 송장 하나**를 추적한다.
 *
 * 공동구매는 브랜드가 다르면 따로 발송되어 한 주문에 송장이 여럿 생긴다 — 주문 상세에 이력을 다
 * 펼치면 어느 상품의 이력인지 알 수 없어 이 화면이 송장 단위로 책임진다. 상단에 대상 상품 한 건을
 * 다시 보여주는 것도 같은 이유다.
 *
 * 결론을 제목으로 답한다(「9.16 (수) 상품 배송이 완료되었어요」) — 이 화면에 들어오는 이유가
 * 그 한 문장이고, 스캔 이력은 근거다. 3구간 바는 택배사 스캔을 사용자 언어로 접은 것이다.
 *
 * 교환 새 상품 · 반려 상품 재발송도 같은 화면이다(브랜드 → 고객 방향의 새 송장). 주문 날짜 앞
 * 회색 라벨과 상품 아래 안내 한 줄로 어느 배송인지 가른다 — 문구는 서버가 내린다.
 */
const STAGES = ["배송 시작", "배송중", "배송 완료"];

/** 배송완료 구간에서 생기는 질문 — 앱 고정(고객센터 FAQ와 동기화되면 그쪽 API로 바꾼다) */
const LEAD_DAYS_QUESTION = "공동구매 상품은 언제 발송되나요?";

const FAQ = [
  {
    q: "배송완료인데 상품을 받지 못했어요.",
    a: "문 앞·경비실·택배함을 먼저 확인해 주세요. 그래도 없으면 택배사에 배송 위치를 문의하고, 해결되지 않으면 마이 탭 > 1:1 문의로 알려주시면 브랜드와 함께 확인해 드려요.",
  },
  { q: LEAD_DAYS_QUESTION, a: "" },
  {
    q: "주문한 상품이 따로 도착했어요.",
    a: "쇼룸과 브랜드가 다르면 따로 발송돼 도착일이 달라질 수 있어요. 상품마다 배송 조회를 따로 확인할 수 있습니다.",
  },
  {
    q: "배송 정보가 며칠째 그대로예요.",
    a: "택배사 스캔이 늦게 반영되는 경우가 있어요. 3일 이상 변동이 없으면 송장번호로 택배사에 문의하거나 1:1 문의를 남겨주세요.",
  },
];

/**
 * 발송 기한은 상품(브랜드)마다 다르다 — 상품 상세의 `shippingLeadDays`를 쓰고, 아직 모르면 숫자 없이 적는다.
 * 배송 조회 응답에 상품 id가 없어 주문 상세에서 찾아 상품 상세를 부른다(둘 다 보통 이미 캐시에 있다).
 */
function buildFaq(shippingLeadDays: number | undefined) {
  return FAQ.map(faq =>
    faq.q === LEAD_DAYS_QUESTION
      ? {
          ...faq,
          a: shippingLeadDays
            ? `공구 마감 후 영업일 ${shippingLeadDays}일 내에 순차 발송돼요. 마감 전에는 송장이 생기지 않습니다.`
            : "공구 마감 후 상품마다 정해진 영업일 안에 순차 발송돼요. 마감 전에는 송장이 생기지 않습니다.",
        }
      : faq
  );
}

/**
 * C10-2 1d 추적 정지 — **DEV 빌드 전용** 목업. 개발 서버에 정지 API가 아직 없고(2026-10-24 BE main),
 * 있어도 택배사 스캔이 N일 멈춘 주문을 만들 수 없어 응답을 골라 덮는다. 값은 시안대로(정지 7일 기준).
 */
type DevStallMock = "OFF" | "WAITING" | "OPEN" | "CHOSEN";

const DEV_STALL_OPTIONS: Array<{ value: DevStallMock; label: string }> = [
  { value: "OFF", label: "실제" },
  { value: "WAITING", label: "대기" },
  { value: "OPEN", label: "선택 가능" },
  { value: "CHOSEN", label: "선택함" },
];

const STALL_CHOICE_LABEL: Record<StallChoice, string> = { RESHIP: "재발송", REFUND: "환불" };

function buildDevStall(mock: Exclude<DevStallMock, "OFF">, choice: StallChoice | null): StallChoiceResponse {
  return {
    deliveryGroupId: 0,
    state: mock,
    opensAt: null,
    daysUntilOpen: mock === "WAITING" ? 4 : null,
    daysStalled: mock === "WAITING" ? 3 : 7,
    choice: mock === "CHOSEN" ? (choice ?? "RESHIP") : null,
    choiceLabel: mock === "CHOSEN" ? STALL_CHOICE_LABEL[choice ?? "RESHIP"] : null,
    chosenAt: null,
  };
}

export default function DeliveryTrackingView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.DELIVERY_TRACKING>>();
  const { data: tracking, isLoading } = useGetTracking(params);
  const { data: order } = useGetOrderDetail(params.orderId);
  const productId = order?.items.find(item => item.orderProductId === params.orderProductId)?.productId ?? 0;
  const { data: product } = useGetProductDetail(productId);
  const { open } = useOrderNavigation();

  const [devStall, setDevStall] = useState<DevStallMock>("OFF");
  const [devChoice, setDevChoice] = useState<StallChoice | null>(null);
  const stall =
    __DEV__ && devStall !== "OFF" ? buildDevStall(devStall, devChoice) : (tracking?.stall ?? null);

  const { mutate: chooseStall, isPending: isChoosingStall } = useMutation({
    mutationFn: (choice: StallChoice) => {
      if (__DEV__ && devStall !== "OFF") {
        return Promise.resolve(buildDevStall("CHOSEN", choice));
      }
      return orderService.chooseStall(stall!.deliveryGroupId, choice);
    },
    onSuccess: result => {
      if (__DEV__ && devStall !== "OFF") {
        setDevChoice(result.choice);
        setDevStall("CHOSEN");
        return;
      }
      void queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.ITEM_TRACKING] });
    },
    onError: error => toast.show(resolveErrorMessage(error, "요청하지 못했어요. 잠시 후 다시 시도해 주세요")),
  });

  const scanRows = (tracking?.scans ?? []).map((scan, ix) => ({
    key: `${scan.occurredAt}-${ix}`,
    title: `${scan.location} · ${scan.description}`,
    time: formatScanTime(scan.occurredAt),
  }));
  const collapsible = useCollapsibleRows(scanRows);

  if (isLoading || !tracking) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="배송 조회" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const isNotShipped = tracking.state === "NOT_SHIPPED";
  const isDelivered = tracking.state === "DELIVERED";
  const hasContext = tracking.context !== "ORDER" && !!tracking.contextLabel;
  const { item } = tracking;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="배송 조회" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <DevMockSwitch
          label="DEV 추적 정지"
          options={DEV_STALL_OPTIONS}
          current={devStall}
          onPick={setDevStall}
        />
        {!!stall && (
          <TrackingStallBlock stall={stall} isSubmitting={isChoosingStall} onChoose={chooseStall} />
        )}

        <TrackingHeadline
          date={tracking.headline.date ? formatShortMonthDayWeekday(tracking.headline.date) : undefined}
          text={tracking.headline.text}
          sub={tracking.headline.sub}
        />

        <StageBar labels={STAGES} current={tracking.stageIndex} />

        <Band marginTop={22} />

        <View className="flex-row items-baseline justify-between px-14" style={{ paddingTop: 18, gap: 10 }}>
          <View className="min-w-0 flex-row items-center" style={{ gap: 7 }}>
            {hasContext && (
              <View className="rounded-base bg-fill px-8 py-4">
                <Typography variant="badge" className="text-gray45">
                  {tracking.contextLabel}
                </Typography>
              </View>
            )}
            <Typography style={{ fontSize: 14, fontWeight: "700", lineHeight: 18.2 }} className="text-ink">
              {formatOrderDate(tracking.orderedAt)} 주문
            </Typography>
          </View>
          <UnderlineLink
            label="주문 상세"
            onPress={() => open(COMMON_ROUTES.ORDER_DETAIL, { orderId: tracking.orderId })}
          />
        </View>

        <View className="px-14 pt-12">
          <ProductLine
            thumbnailUrl={item.thumbnailUrl}
            brand={item.brandName}
            name={item.productName}
            option={optionWithQuantity(item.optionName, item.quantity)}
            price={won(item.amount)}
          />
        </View>
        {hasContext && !!tracking.contextNote && (
          <View
            className="mx-14 rounded-base bg-band"
            style={{ marginTop: 14, paddingVertical: 11, paddingHorizontal: 13 }}
          >
            <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
              {tracking.contextNote}
            </Typography>
          </View>
        )}

        <Band marginTop={20} />

        {isNotShipped ? (
          /*
            추적할 것이 없는 상태 — 송장·이력·전화 버튼을 감추고 왜 없는지와 언제 생기는지로 채운다.
            「송장번호 —」 같은 빈 행을 남기면 발급 누락처럼 보인다.
          */
          <>
            <View className="px-14 pt-18" style={{ gap: 9 }}>
              {!!tracking.shipDueAt && (
                <KeyValueRow label="발송 예정" value={`${formatMonthDayWeekday(tracking.shipDueAt)} 예정`} />
              )}
              {!!tracking.groupBuyEndAt && (
                <KeyValueRow label="공구 마감" value={formatDeadline(tracking.groupBuyEndAt)} />
              )}
            </View>
            <NoticeBox style={{ marginTop: 18 }}>
              <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
                공동구매는{" "}
                <Typography
                  style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }}
                  className="text-ink76"
                >
                  마감 후 일괄 발송
                </Typography>
                돼요. 마감 전에는 송장이 생기지 않습니다.
              </Typography>
            </NoticeBox>
          </>
        ) : (
          <>
            <CarrierRows carrier={tracking.carrier} trackingNumber={tracking.trackingNumber} />
            <CarrierButtons carrier={tracking.carrier} />

            <Band marginTop={20} />

            {scanRows.length > 0 && <Timeline rows={collapsible.visible} />}
            <DisclaimerLine text="택배사 배송 추적 정보로, 실제 배송 현황과 차이가 있을 수 있어요." />
            {collapsible.canToggle && (
              <ToggleRowsButton
                isOpen={collapsible.isOpen}
                total={scanRows.length}
                onPress={collapsible.toggle}
              />
            )}
          </>
        )}

        {/* 「배송완료인데 못 받았다」처럼 앱이 답해야 하는 질문은 배송완료 구간에서 생긴다 */}
        {isDelivered && (
          <>
            <Band marginTop={22} />
            <SectionTitle title="배송 관련 안내" />
            <View style={{ paddingTop: 8 }}>
              {buildFaq(product?.delivery?.shippingLeadDays).map(faq => (
                <Accordion key={faq.q} title={faq.q} body={faq.a} withMarker={false} />
              ))}
            </View>
          </>
        )}

        <View className="h-30" />
        <BottomSafeSpacer />
      </ScrollView>
    </View>
  );
}
