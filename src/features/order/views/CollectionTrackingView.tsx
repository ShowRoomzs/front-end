import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  Band,
  OutlineAction,
  ProductLine,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import {
  CarrierButtons,
  CarrierRows,
  DisclaimerLine,
  KeyValueRow,
  StageBar,
  Timeline,
  TrackingHeadline,
} from "@/features/order/components/TrackingParts/TrackingParts";
import { useGetCollectionTracking } from "@/features/order/hooks/useOrderQueries";
import {
  formatMonthDayTime,
  formatMonthDayWeekday,
  formatOrderDate,
  formatScanTime,
} from "@/features/order/utils/orderFormat";

/**
 * C10-4 회수 조회 — 반품 · 교환 공통. C10-2 배송 조회와 같은 틀이고 방향만 반대(고객 → 브랜드)다.
 *
 * 단계 바가 **5칸**이다 — 택배 3칸(접수 · 이동 중 · 도착) 뒤에 브랜드 2칸(검수 · 환불/새 상품)을
 * 붙이고, 바 아래에 「택배사 / 브랜드」 구분선을 둔다. 택배가 배송 완료여도 고객에게는 아직 끝이
 * 아니라서, 검수까지 한 줄로 보여줘야 "도착했는데 왜 환불이 안 되지" 문의가 줄어든다.
 *
 * 송장은 등록됐는데 택배 이력이 없으면 「아직 조회되지 않아요」 — 실패라고 단정하지 않는다(대부분
 * 택배사 반영 지연). 흔한 원인 세 가지를 보여주고, 고칠 수 있으면 [송장 수정]으로 등록 화면을 다시 연다.
 */
export default function CollectionTrackingView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.COLLECTION_TRACKING>>();
  const { data: tracking, isLoading, refetch } = useGetCollectionTracking(params.claimId);

  // [송장 수정] 뒤 돌아오면 다시 읽는다
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  if (isLoading || !tracking) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="회수 조회" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const kindLabel = tracking.type === "EXCHANGE" ? "교환" : "반품";
  const stages =
    tracking.stages.length === 5
      ? tracking.stages
      : ["접수", "이동 중", "도착", "검수", kindLabel === "교환" ? "새 상품" : "환불"];

  const handlePressEditInvoice = () => {
    navigation.navigate(COMMON_ROUTES.CLAIM_INVOICE, {
      claimId: tracking.claimId,
      carrier: (tracking.carrier?.code as never) ?? undefined,
      trackingNumber: tracking.trackingNumber ?? undefined,
    });
  };

  if (!tracking.trackable) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="회수 조회" onPressBack={navigation.goBack} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TrackingHeadline text={tracking.headline.text} sub={tracking.headline.sub} />
          <StageBar labels={stages} current={-1} labelSize={11.5} />
          <Band marginTop={22} />

          <View className="px-14 pt-18" style={{ gap: 9 }}>
            <KeyValueRow label="택배사" value={tracking.carrier?.label ?? "-"} />
            <KeyValueRow label="회수 송장" value={tracking.trackingNumber ?? "-"} />
            {!!tracking.invoiceRegisteredAt && (
              <KeyValueRow label="등록 일시" value={formatMonthDayTime(tracking.invoiceRegisteredAt)} />
            )}
          </View>

          <View className="mx-14 rounded-base bg-band px-14 py-13" style={{ marginTop: 18 }}>
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink">
              이런 경우일 수 있어요
            </Typography>
            <View style={{ marginTop: 9, gap: 4 }}>
              {[
                "송장 번호 숫자가 빠졌거나 잘못 입력됐어요",
                "다른 택배사를 선택했어요",
                "편의점에 맡겼지만 아직 택배사가 가져가지 않았어요",
              ].map(line => (
                <View key={line} className="flex-row" style={{ gap: 7 }}>
                  <Typography style={{ fontSize: 12.5, lineHeight: 20.6 }} className="text-ink76">
                    •
                  </Typography>
                  <Typography
                    style={{ fontSize: 12.5, lineHeight: 20.6 }}
                    className="min-w-0 flex-1 text-ink76"
                  >
                    {line}
                  </Typography>
                </View>
              ))}
            </View>
          </View>

          {tracking.invoiceEditable && (
            <View className="flex-row px-14 pt-16">
              <OutlineAction label="송장 수정" height={44} fontSize={13} onPress={handlePressEditInvoice} />
            </View>
          )}
          <View className="h-30" />
        </ScrollView>
      </View>
    );
  }

  const eventRows = tracking.events.map((event, ix) => ({
    key: `${event.occurredAt}-${ix}`,
    title: event.location ? `${event.location} · ${event.description}` : event.description,
    time: formatScanTime(event.occurredAt),
    isBrand: event.source === "BRAND",
  }));

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="회수 조회" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <TrackingHeadline
          date={tracking.headline.date ? formatMonthDayWeekday(tracking.headline.date) : undefined}
          text={tracking.headline.text}
          sub={tracking.headline.sub}
        />

        <StageBar labels={stages} current={tracking.stageIndex} labelSize={11.5} />
        <View className="flex-row px-14 pt-8" style={{ gap: 6 }}>
          <Typography
            style={{
              flex: 3,
              fontSize: 10.5,
              lineHeight: 13.65,
              paddingTop: 5,
              borderTopWidth: 0.5,
              borderTopColor: "#EAEAEC",
            }}
            className="text-gray62"
          >
            택배사
          </Typography>
          <Typography
            style={{
              flex: 2,
              fontSize: 10.5,
              lineHeight: 13.65,
              paddingTop: 5,
              borderTopWidth: 0.5,
              borderTopColor: "#EAEAEC",
            }}
            className="text-gray62"
          >
            브랜드
          </Typography>
        </View>

        <Band marginTop={20} />

        <View className="flex-row items-baseline justify-between px-14" style={{ paddingTop: 18, gap: 10 }}>
          <Typography style={{ fontSize: 14, fontWeight: "700", lineHeight: 18.2 }} className="text-ink">
            {kindLabel} 요청 · {formatOrderDate(tracking.requestedAt)}
          </Typography>
          <UnderlineLink
            label={`${kindLabel} 상세`}
            onPress={() => navigation.navigate(COMMON_ROUTES.CLAIM_DETAIL, { claimId: tracking.claimId })}
          />
        </View>
        <View className="px-14 pt-12">
          <ProductLine
            thumbnailUrl={tracking.item.thumbnailUrl}
            brand={tracking.item.brandName}
            name={tracking.item.productName}
            option={tracking.item.optionLabel}
          />
        </View>

        <Band marginTop={20} />

        <CarrierRows
          carrier={tracking.carrier}
          trackingNumber={tracking.trackingNumber}
          invoiceLabel="회수 송장"
          extraRows={[
            { label: "보내는 분", value: tracking.sender },
            { label: "받는 곳", value: tracking.receiver },
          ]}
        />
        <CarrierButtons carrier={tracking.carrier} />

        <Band marginTop={20} />

        {eventRows.length > 0 && <Timeline rows={eventRows} firstFilled gap={18} />}
        <DisclaimerLine text="택배 이력은 택배사 추적 정보이고, 입고·검수는 브랜드가 등록한 정보예요." />

        <View className="h-30" />
      </ScrollView>
    </View>
  );
}
