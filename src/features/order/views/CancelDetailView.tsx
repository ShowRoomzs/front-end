import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { queryClient } from "@/common/lib/queryClient";
import { useModal } from "@/common/providers/ModalProvider/context";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  AmountRow,
  Band,
  BottomSafeSpacer,
  BulletNotes,
  InfoRow,
  OutlineAction,
  ProductBlock,
  SectionTitle,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { invalidateOrderQueries, useGetOrderDetail } from "@/features/order/hooks/useOrderQueries";
import { cancelRequestService } from "@/features/order/services/cancelRequestService";
import { CancelDetail, CancelPhase } from "@/features/order/types/cancelRequest";
import {
  formatDateTimeFull,
  formatRequestedAt,
  resolveErrorMessage,
  withOption,
  won,
} from "@/features/order/utils/orderFormat";

/**
 * C10 1d 취소 상세 — 확인 중 · 취소 완료 · 거부. 항목 기준이라 요청 · 직접 취소 · 직권 취소가 같은 화면이다.
 *
 * 구성: 신청 일시 + 주문번호 + [주문 상세] → 취소 상품(상품 위 상태 라벨) → 상품 아래 행동 버튼 →
 * 취소 신청 정보(라벨 열 고정) → 환불 정보 → 안내.
 *
 * - 확인 중: 라벨 로즈 · 회색 안내 박스 · 완료 일시는 「브랜드 확인 후 표시돼요」
 * - 취소 완료: 라벨 회색 · 금액 라벨 「환불 금액」 · [재구매]
 * - 거부: 박스 「주문은 그대로 배송돼요」 · 거부 사유 행 + 「○○의 메시지」 · 금액 0원(회색) · [배송 조회]
 *
 * 상태 라벨 · 안내 문구 · 사유는 서버가 내린다. 응답에 없는 브랜드명 · 상품 id(재구매) · 결제 수단은 주문
 * 상세의 같은 항목에서 읽는다. [취소 요청 철회]는 서버가 `withdrawable`을 줄 때만 그린다(요청 단위 철회).
 */
const CANCEL_DETAIL_KEY = "cancelDetail";

const PHASE_COLOR: Record<CancelPhase, string> = {
  REVIEWING: "#CF3D61",
  CANCELLED: "#737373",
  REJECTED: "#3C3C3C",
};

export default function CancelDetailView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CANCEL_DETAIL>>();
  const { orderId, orderProductId, devMockRequestId } = params;
  const { show: showModal } = useModal();
  const { open } = useOrderNavigation();
  const { data: order } = useGetOrderDetail(orderId);

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: [CANCEL_DETAIL_KEY, orderId, orderProductId, devMockRequestId],
    queryFn: () =>
      devMockRequestId
        ? cancelRequestService.getMockDetail(devMockRequestId)
        : cancelRequestService.getDetail(orderId, orderProductId),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [CANCEL_DETAIL_KEY, orderId, orderProductId] });
  }, [orderId, orderProductId]);

  const cancelRequestId = detail?.cancelRequestId ?? null;

  const handlePressWithdraw = useCallback(() => {
    if (!devMockRequestId && !cancelRequestId) {
      return;
    }
    showModal({
      title: "취소 요청을 철회할까요?",
      message: "철회하면 주문이 그대로 진행되고\n상품이 발송돼요.",
      buttons: [
        { label: "닫기", variant: "outline" },
        {
          label: "철회하기",
          onPress: async () => {
            try {
              if (devMockRequestId) {
                await cancelRequestService.withdrawMock(devMockRequestId);
              } else if (cancelRequestId) {
                await cancelRequestService.withdraw(orderId, cancelRequestId);
                // 항목이 상품준비중으로 돌아간다 — 주문 내역 · 상세를 다시 읽는다
                invalidateOrderQueries();
              }
              toast.show("취소 요청을 철회했어요");
              navigation.goBack();
            } catch (error) {
              // 409 — 그사이 브랜드가 승인 · 거부했거나 자동 승인됐다. 지금 상태를 다시 보여준다
              toast.show(resolveErrorMessage(error, "취소 요청을 철회하지 못했어요"));
              refresh();
            }
          },
        },
      ],
    });
  }, [cancelRequestId, devMockRequestId, navigation, orderId, refresh, showModal]);

  if (isLoading || !detail) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="취소 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center px-40">
          {isLoading ? (
            <Spinner />
          ) : (
            <Typography style={{ fontSize: 13, lineHeight: 22.1 }} className="text-center text-gray45">
              {resolveErrorMessage(error, "취소 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.")}
            </Typography>
          )}
        </View>
      </View>
    );
  }

  const isPending = detail.phase === "REVIEWING";
  const isRejected = detail.phase === "REJECTED";
  const isCancelled = detail.phase === "CANCELLED";
  const firstItem = detail.items[0];
  // 응답에 없는 값 — 주문 상세의 같은 항목에서 읽는다
  const rowOf = (id: number) => order?.items.find(row => row.orderProductId === id);
  const firstRow = firstItem ? rowOf(firstItem.orderProductId) : undefined;
  const paidAmount = detail.items.reduce((sum, item) => sum + item.amount, 0);
  const refundAmount = detail.refund?.amount ?? (isRejected ? 0 : paidAmount);
  const refundMethodLabel = detail.refund?.methodLabel ?? order?.payment?.methodLabel ?? null;

  // 직접 · 직권 취소는 신청이 없어 확정 시각이 곧 취소 시각이다
  let decidedLabel = detail.kind === "REQUEST" ? "완료 일시" : "취소 일시";

  if (isRejected) {
    decidedLabel = "거부 일시";
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="취소 상세" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-end px-14" style={{ paddingTop: 22, paddingBottom: 18, gap: 12 }}>
          <View className="min-w-0 flex-1">
            <Typography
              style={{ fontSize: 19, fontWeight: "700", lineHeight: 24.7, letterSpacing: -0.4 }}
              className="text-ink"
            >
              {formatRequestedAt(detail.requestedAt ?? detail.decidedAt)}
            </Typography>
            <Typography style={{ fontSize: 12.5, lineHeight: 17.5, marginTop: 7 }} className="text-gray45">
              주문번호 {detail.orderNumber}
            </Typography>
          </View>
          <UnderlineLink
            label="주문 상세"
            onPress={() => open(COMMON_ROUTES.ORDER_DETAIL, { orderId: detail.orderId })}
          />
        </View>
        <Band />

        <SectionTitle title="취소 상품" count={`${detail.items.length}개`} />
        <Typography
          style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5, color: PHASE_COLOR[detail.phase] }}
          className="px-14 pt-16"
        >
          {detail.phaseLabel}
        </Typography>
        {detail.items.map(item => (
          <View key={item.orderProductId} className="px-14 pt-12">
            <ProductBlock
              thumbnailUrl={item.thumbnailUrl}
              brand={rowOf(item.orderProductId)?.brandName ?? ""}
              name={item.productName}
              meta={withOption(item.optionName, `${item.quantity}개`, " / ")}
              price={won(item.amount)}
            />
          </View>
        ))}

        {!isCancelled && (
          <View
            className="mx-14 rounded-base bg-band"
            style={{ marginTop: 14, paddingVertical: 12, paddingHorizontal: 13 }}
          >
            <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
              {isPending
                ? "브랜드가 확인하고 있어요. 보통 1영업일 안에 결과를 알림으로 알려드려요."
                : "브랜드가 취소 요청을 거부했어요. 주문은 그대로 배송돼요."}
            </Typography>
          </View>
        )}

        <View className="flex-row px-14 pt-12">
          {isPending && detail.withdrawable && (
            <OutlineAction label="취소 요청 철회" height={44} fontSize={13.5} onPress={handlePressWithdraw} />
          )}
          {isCancelled && !!firstRow && (
            <OutlineAction
              label="재구매"
              height={44}
              fontSize={13.5}
              onPress={() => open(COMMON_ROUTES.PRODUCT_DETAIL, { productId: firstRow.productId })}
            />
          )}
          {isRejected && !!firstItem && (
            <OutlineAction
              label="배송 조회"
              height={44}
              fontSize={13.5}
              onPress={() =>
                open(COMMON_ROUTES.DELIVERY_TRACKING, {
                  orderId: detail.orderId,
                  orderProductId: firstItem.orderProductId,
                })
              }
            />
          )}
        </View>

        <Band marginTop={20} />
        <SectionTitle title="취소 신청 정보" style={{ paddingBottom: 8 }} />
        <View className="px-14">
          {!!detail.requestedAt && (
            <InfoRow label="신청 일시" labelWidth={62} value={formatDateTimeFull(detail.requestedAt)} />
          )}
          <InfoRow
            label={decidedLabel}
            labelWidth={62}
            value={detail.decidedAt ? formatDateTimeFull(detail.decidedAt) : "브랜드 확인 후 표시돼요"}
            valueColor={detail.decidedAt ? "#0F0F0F" : "#9E9E9E"}
          />
          <InfoRow
            label="취소 사유"
            labelWidth={62}
            value={detail.reasonDetail ? `${detail.reasonLabel}\n${detail.reasonDetail}` : detail.reasonLabel}
          />
          {isRejected && !!detail.rejection && (
            <RejectRows detail={detail} brandName={firstRow?.brandName ?? ""} />
          )}
        </View>

        <Band marginTop={14} />
        <SectionTitle title="환불 정보" />
        <View className="px-14 pt-14">
          <AmountRow label="결제 금액" value={won(paidAmount)} labelColor="#3C3C3C" fontSize={13.5} />
        </View>
        <View
          className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
          style={{ marginTop: 12, paddingTop: 12, gap: 12 }}
        >
          <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
            {isCancelled ? "환불 금액" : "환불 예정 금액"}
          </Typography>
          <Typography
            style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
            className={isRejected ? "text-gray62" : "text-ink"}
          >
            {won(refundAmount)}
          </Typography>
        </View>
        {!isRejected && !!refundMethodLabel && (
          <View className="px-14 pt-9">
            <AmountRow label="환불 수단" value={refundMethodLabel} fontSize={12.5} valueColor="#3C3C3C" />
          </View>
        )}
        {!!detail.refund?.statusLabel && (
          <View className="px-14 pt-9">
            <AmountRow
              label="환불 상태"
              value={detail.refund.statusLabel}
              fontSize={12.5}
              valueColor="#3C3C3C"
            />
          </View>
        )}
        <BulletNotes style={{ paddingHorizontal: 14, paddingTop: 18 }} notes={notesFor(detail)} />

        {!!devMockRequestId && (
          <DevStatusSwitch
            current={detail.phase}
            onPick={next => {
              cancelRequestService.devSetPhase(devMockRequestId, next);
              refresh();
            }}
          />
        )}
        <View className="h-26" />
        <BottomSafeSpacer />
      </ScrollView>
    </View>
  );
}

/** 거부 사유 — 서버 문구 그대로, 브랜드가 쓴 상세 사유는 출처를 밝혀 따로 단다 */
function RejectRows(props: { detail: CancelDetail; brandName: string }) {
  const { detail, brandName } = props;

  return (
    <>
      <View className="flex-row" style={{ gap: 14, paddingVertical: 6 }}>
        <Typography style={{ width: 62, fontSize: 13.5, lineHeight: 20.25 }} className="text-gray45">
          거부 사유
        </Typography>
        <Typography
          style={{ flex: 1, fontSize: 13.5, fontWeight: "600", lineHeight: 20.25 }}
          className="text-ink"
        >
          {detail.rejection?.reasonLabel}
        </Typography>
      </View>
      {!!detail.rejection?.detail && (
        <View
          className="rounded-base bg-band"
          style={{ marginTop: 6, marginBottom: 2, paddingVertical: 12, paddingHorizontal: 13 }}
        >
          <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
            {brandName ? `${brandName}의 메시지` : "브랜드 메시지"}
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 7 }} className="text-ink76">
            {detail.rejection.detail}
          </Typography>
        </View>
      )}
    </>
  );
}

/** 안내 — 서버 문구를 먼저 쓰고, 서버가 비워 두는 취소 완료에는 카드사 처리 기간을 단다 */
function notesFor(detail: CancelDetail) {
  const notes = [...detail.notices];

  if (detail.autoApproved) {
    notes.unshift("브랜드가 기한 안에 확인하지 않아 자동으로 취소됐어요.");
  }
  if (detail.phase === "CANCELLED") {
    notes.push("카드사 처리에 2~3영업일이 더 걸릴 수 있어요.");
  }
  return notes;
}

/** DEV 목업 요청에서만 — 세 상태를 눈으로 확인하는 스위치(배포본에는 그리지 않는다) */
function DevStatusSwitch(props: { current: CancelPhase; onPick: (phase: CancelPhase) => void }) {
  if (!__DEV__) {
    return null;
  }
  const options: Array<{ phase: CancelPhase; label: string }> = [
    { phase: "REVIEWING", label: "확인 중" },
    { phase: "CANCELLED", label: "취소 완료" },
    { phase: "REJECTED", label: "거부" },
  ];

  return (
    <View className="flex-row items-center px-14 pt-20" style={{ gap: 6 }}>
      <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
        DEV 목업 상태
      </Typography>
      {options.map(option => (
        <TouchableOpacity
          key={option.phase}
          onPress={() => props.onPick(option.phase)}
          activeOpacity={0.6}
          className="rounded-full border-[1px] px-10 py-6"
          style={{
            borderColor: option.phase === props.current ? "#1A1A1A" : "#E3E3E5",
            backgroundColor: option.phase === props.current ? "#1A1A1A" : "#FFFFFF",
          }}
        >
          <Typography
            style={{ fontSize: 11, lineHeight: 11 }}
            className={option.phase === props.current ? "text-white" : "text-ink76"}
          >
            {option.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
}
