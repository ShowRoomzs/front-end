import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, View } from "react-native";

import Accordion from "@/common/components/Accordion/Accordion";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  Band,
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
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { useGetTracking } from "@/features/order/hooks/useOrderQueries";
import {
  formatDeadline,
  formatMonthDayWeekday,
  formatOrderDate,
  formatScanTime,
  formatShortMonthDayWeekday,
  optionWithQuantity,
  won,
} from "@/features/order/utils/orderFormat";

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
const FAQ = [
  {
    q: "배송완료인데 상품을 받지 못했어요.",
    a: "문 앞·경비실·택배함을 먼저 확인해 주세요. 그래도 없으면 택배사에 배송 위치를 문의하고, 해결되지 않으면 마이 탭 > 1:1 문의로 알려주시면 브랜드와 함께 확인해 드려요.",
  },
  {
    q: "공동구매 상품은 언제 발송되나요?",
    a: "공구 마감 후 영업일 3일 내에 순차 발송돼요. 마감 전에는 송장이 생기지 않습니다.",
  },
  {
    q: "주문한 상품이 따로 도착했어요.",
    a: "쇼룸과 브랜드가 다르면 따로 발송돼 도착일이 달라질 수 있어요. 상품마다 배송 조회를 따로 확인할 수 있습니다.",
  },
  {
    q: "배송 정보가 며칠째 그대로예요.",
    a: "택배사 스캔이 늦게 반영되는 경우가 있어요. 3일 이상 변동이 없으면 송장번호로 택배사에 문의하거나 1:1 문의를 남겨주세요.",
  },
];

export default function DeliveryTrackingView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.DELIVERY_TRACKING>>();
  const { data: tracking, isLoading } = useGetTracking(params);
  const { open } = useOrderNavigation();

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
              {FAQ.map(faq => (
                <Accordion key={faq.q} title={faq.q} body={faq.a} withMarker={false} />
              ))}
            </View>
          </>
        )}

        <View className="h-30" />
      </ScrollView>
    </View>
  );
}
