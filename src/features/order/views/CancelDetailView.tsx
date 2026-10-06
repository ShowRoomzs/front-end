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
  BulletNotes,
  InfoRow,
  OutlineAction,
  ProductBlock,
  SectionTitle,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import {
  CANCEL_REQUEST_AVAILABLE,
  CANCEL_REQUEST_NOT_READY_MESSAGE,
  cancelRequestService,
} from "@/features/order/services/cancelRequestService";
import {
  CANCEL_REJECT_REASON_LABEL,
  CANCEL_REQUEST_REASONS,
  CancelRequestDetail,
  CancelRequestStatus,
} from "@/features/order/types/cancelRequest";
import { formatDateTimeFull, formatRequestedAt, won } from "@/features/order/utils/orderFormat";

/**
 * C10 1d 취소 상세 — 확인 중 · 승인 · 반려.
 *
 * 구성: 신청 일시 + 주문번호 + [주문 상세] → 취소 상품(상품 위 상태 라벨) → 상품 아래 행동 버튼 →
 * 취소 신청 정보(라벨 열 고정) → 환불 정보 → 안내.
 *
 * - 확인 중: 라벨 로즈(철회할 수 있다) · 회색 안내 박스 · 완료 일시는 「브랜드 확인 후 표시돼요」 · [취소 요청 철회]
 * - 승인: 라벨 「취소 완료」 회색 · 금액 라벨 「환불 금액」 · [재구매]
 * - 반려: 박스 「주문은 그대로 배송돼요」 · 반려 사유 행(어드민 4종 문구 그대로) + 「○○의 메시지」 ·
 *   금액 0원(회색) · [배송 조회] — 받은 뒤 반품으로 이어가는 길을 바로 연다
 *
 * ⚠️ 앱용 API가 없어 DEV에서만 목업으로 열린다. 배포본은 「준비 중」을 띄운다.
 */
const CANCEL_DETAIL_KEY = "cancelRequestDetail";

const STATUS_VIEW: Record<CancelRequestStatus, { label: string; color: string }> = {
  PENDING: { label: "취소 요청 · 브랜드 확인 중", color: "#CF3D61" },
  APPROVED: { label: "취소 완료", color: "#737373" },
  REJECTED: { label: "취소 반려", color: "#3C3C3C" },
};

export default function CancelDetailView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CANCEL_DETAIL>>();
  const { cancelRequestId } = params;
  const { show: showModal } = useModal();
  const { open } = useOrderNavigation();

  const { data: detail, isLoading } = useQuery({
    queryKey: [CANCEL_DETAIL_KEY, cancelRequestId],
    queryFn: () => cancelRequestService.getDetail(cancelRequestId),
    enabled: CANCEL_REQUEST_AVAILABLE,
    retry: false,
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [CANCEL_DETAIL_KEY, cancelRequestId] });
  }, [cancelRequestId]);

  const handlePressWithdraw = useCallback(() => {
    showModal({
      title: "취소 요청을 철회할까요?",
      message: "철회하면 주문이 그대로 진행되고\n상품이 발송돼요.",
      buttons: [
        { label: "닫기", variant: "outline" },
        {
          label: "철회하기",
          onPress: async () => {
            await cancelRequestService.withdraw(cancelRequestId);
            toast.show("취소 요청을 철회했어요");
            navigation.goBack();
          },
        },
      ],
    });
  }, [cancelRequestId, navigation, showModal]);

  if (!CANCEL_REQUEST_AVAILABLE) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="취소 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center px-40">
          <Typography
            style={{ fontSize: 15.5, fontWeight: "600", lineHeight: 23.25 }}
            className="text-center text-ink"
          >
            취소 상세를 준비하고 있어요
          </Typography>
          <Typography
            style={{ fontSize: 13, lineHeight: 22.1, marginTop: 7 }}
            className="text-center text-gray45"
          >
            {CANCEL_REQUEST_NOT_READY_MESSAGE}
          </Typography>
        </View>
      </View>
    );
  }

  if (isLoading || !detail) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="취소 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">{isLoading && <Spinner />}</View>
      </View>
    );
  }

  const status = STATUS_VIEW[detail.status];
  const isPending = detail.status === "PENDING";
  const isRejected = detail.status === "REJECTED";
  const firstItem = detail.items[0];

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
              {formatRequestedAt(detail.requestedAt)}
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
          style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5, color: status.color }}
          className="px-14 pt-16"
        >
          {status.label}
        </Typography>
        {detail.items.map(item => (
          <View key={item.orderProductId} className="px-14 pt-12">
            <ProductBlock
              thumbnailUrl={item.thumbnailUrl}
              brand={item.brandName}
              name={item.productName}
              meta={`${item.optionName} / ${item.quantity}개`}
              price={won(item.amount)}
            />
          </View>
        ))}

        {detail.status !== "APPROVED" && (
          <View
            className="mx-14 rounded-base bg-band"
            style={{ marginTop: 14, paddingVertical: 12, paddingHorizontal: 13 }}
          >
            <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
              {isPending
                ? "브랜드가 확인하고 있어요. 보통 1영업일 안에 결과를 알림으로 알려드려요."
                : "브랜드가 취소 요청을 반려했어요. 주문은 그대로 배송돼요."}
            </Typography>
          </View>
        )}

        <View className="flex-row px-14 pt-12">
          {isPending && (
            <OutlineAction label="취소 요청 철회" height={44} fontSize={13.5} onPress={handlePressWithdraw} />
          )}
          {detail.status === "APPROVED" && !!firstItem && (
            <OutlineAction
              label="재구매"
              height={44}
              fontSize={13.5}
              onPress={() => open(COMMON_ROUTES.PRODUCT_DETAIL, { productId: firstItem.productId })}
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
          <InfoRow label="신청 일시" labelWidth={62} value={formatDateTimeFull(detail.requestedAt)} />
          <InfoRow
            label={isRejected ? "반려 일시" : "완료 일시"}
            labelWidth={62}
            value={detail.decidedAt ? formatDateTimeFull(detail.decidedAt) : "브랜드 확인 후 표시돼요"}
            valueColor={detail.decidedAt ? "#0F0F0F" : "#9E9E9E"}
          />
          <InfoRow
            label="취소 사유"
            labelWidth={62}
            value={
              detail.reasonDetail ??
              CANCEL_REQUEST_REASONS.find(item => item.code === detail.reason)?.text ??
              ""
            }
          />
          {isRejected && !!detail.rejectReason && <RejectRows detail={detail} />}
        </View>

        <Band marginTop={14} />
        <SectionTitle title="환불 정보" />
        <View className="px-14 pt-14">
          <AmountRow label="결제 금액" value={won(detail.paidAmount)} labelColor="#3C3C3C" fontSize={13.5} />
        </View>
        <View
          className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
          style={{ marginTop: 12, paddingTop: 12, gap: 12 }}
        >
          <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
            {detail.status === "APPROVED" ? "환불 금액" : "환불 예정 금액"}
          </Typography>
          <Typography
            style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
            className={isRejected ? "text-gray62" : "text-ink"}
          >
            {won(isRejected ? 0 : detail.refundAmount)}
          </Typography>
        </View>
        {!!detail.refundMethodLabel && (
          <View className="px-14 pt-9">
            <AmountRow
              label="환불 수단"
              value={detail.refundMethodLabel}
              fontSize={12.5}
              valueColor="#3C3C3C"
            />
          </View>
        )}
        <BulletNotes style={{ paddingHorizontal: 14, paddingTop: 18 }} notes={[noteFor(detail)]} />

        <DevStatusSwitch
          current={detail.status}
          onPick={next => {
            cancelRequestService.devSetStatus(cancelRequestId, next);
            refresh();
          }}
        />
        <View className="h-26" />
      </ScrollView>
    </View>
  );
}

/** 반려 사유 — 어드민의 거부 사유 문구 그대로, 브랜드가 쓴 상세 사유는 출처를 밝혀 따로 단다 */
function RejectRows(props: { detail: CancelRequestDetail }) {
  const { detail } = props;

  return (
    <>
      <View className="flex-row" style={{ gap: 14, paddingVertical: 6 }}>
        <Typography style={{ width: 62, fontSize: 13.5, lineHeight: 20.25 }} className="text-gray45">
          반려 사유
        </Typography>
        <Typography
          style={{ flex: 1, fontSize: 13.5, fontWeight: "600", lineHeight: 20.25 }}
          className="text-ink"
        >
          {CANCEL_REJECT_REASON_LABEL[detail.rejectReason!]}
        </Typography>
      </View>
      {!!detail.rejectMessage && (
        <View
          className="rounded-base bg-band"
          style={{ marginTop: 6, marginBottom: 2, paddingVertical: 12, paddingHorizontal: 13 }}
        >
          <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
            {detail.items[0]?.brandName}의 메시지
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 7 }} className="text-ink76">
            {detail.rejectMessage}
          </Typography>
        </View>
      )}
    </>
  );
}

function noteFor(detail: CancelRequestDetail) {
  if (detail.status === "PENDING") {
    return "브랜드가 1영업일(주말·공휴일 제외) 안에 확인하지 않으면 자동으로 취소돼요. 확인 전까지는 요청을 철회할 수 있어요.";
  }
  if (detail.status === "APPROVED") {
    return "카드사 처리에 2~3영업일이 더 걸릴 수 있어요.";
  }
  return detail.rejectReason === "CUSTOM_MADE"
    ? "주문 제작·맞춤 상품은 단순 변심 반품이 제한될 수 있어요."
    : "배송완료 후 7일 이내에 주문 상세에서 반품을 신청할 수 있어요.";
}

/** DEV 빌드에서만 — 목업의 세 상태를 눈으로 확인하는 스위치(배포본에는 그리지 않는다) */
function DevStatusSwitch(props: {
  current: CancelRequestStatus;
  onPick: (status: CancelRequestStatus) => void;
}) {
  if (!__DEV__) {
    return null;
  }
  const options: Array<{ status: CancelRequestStatus; label: string }> = [
    { status: "PENDING", label: "확인 중" },
    { status: "APPROVED", label: "승인" },
    { status: "REJECTED", label: "반려" },
  ];

  return (
    <View className="flex-row items-center px-14 pt-20" style={{ gap: 6 }}>
      <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
        DEV 목업 상태
      </Typography>
      {options.map(option => (
        <TouchableOpacity
          key={option.status}
          onPress={() => props.onPick(option.status)}
          activeOpacity={0.6}
          className="rounded-full border-[1px] px-10 py-6"
          style={{
            borderColor: option.status === props.current ? "#1A1A1A" : "#E3E3E5",
            backgroundColor: option.status === props.current ? "#1A1A1A" : "#FFFFFF",
          }}
        >
          <Typography
            style={{ fontSize: 11, lineHeight: 11 }}
            className={option.status === props.current ? "text-white" : "text-ink76"}
          >
            {option.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
}
