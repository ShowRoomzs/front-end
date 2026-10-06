import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import Svg, { Path } from "react-native-svg";

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
  BottomCta,
  BulletNotes,
  CautionBox,
  InfoRow,
  OutlineAction,
  ProductBlock,
  SectionTitle,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import PaymentMethodPicker from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";
import PortOnePaymentModal from "@/features/order/components/PortOnePaymentModal/PortOnePaymentModal";
import { ORDER_QUERY_KEY } from "@/features/order/constants/queryKey";
import { ClaimPaymentOutcome, useClaimPayment } from "@/features/order/hooks/useClaimPayment";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { invalidateOrderQueries, useGetClaimDetail } from "@/features/order/hooks/useOrderQueries";
import { claimService } from "@/features/order/services/claimService";
import {
  ClaimAction,
  ClaimDetailItem,
  ClaimDetailResponse,
  ClaimReshipFee,
  UserClaimPhase,
} from "@/features/order/types/claim";
import { MaskedAddress } from "@/features/order/types/order";
import { isPaymentSelectionComplete, PaymentMethods, PaymentSelection } from "@/features/order/types/payment";
import {
  formatDateTimeFull,
  formatDueDate,
  formatMonthDay,
  formatRequestedAt,
  resolveErrorMessage,
  won,
} from "@/features/order/utils/orderFormat";

/**
 * C10-5 반품 · 교환 상세 — 진행 중 · 종결 · 검수 반려(재발송비 결제)를 한 화면이 상태별로 그린다.
 *
 * 구성: 신청 일시 + 주문번호 + [주문 상세] → 「반품 상품 N개」 → 유의 박스 → 상품마다(상태 줄 ·
 * 상품 · 버튼 · 반려 사유) → 상품 다시 받기 → 신청 정보 → 환불/결제 정보 → 안내.
 *
 * 한 요청(박스)에 상품이 여럿이면 **상품마다 상태가 갈린다**(일부 반려) — 상태 줄 · 버튼은 항목별이고
 * 서버가 라벨·문구·버튼을 내린다. 로즈는 고객이 해야 할 일이 있을 때만(송장 입력 · 재발송비 결제).
 *
 * 검수 반려는 상품이 브랜드에 도착한 뒤에만 일어난다. 반려 사유 블록은 사유 · 법적 근거 · 브랜드
 * 증빙 사진 · 브랜드 메시지를 보여주고(브랜드가 쓴 문장은 출처를 밝혀 따로 둔다), 다시 받으려면
 * 재발송 배송비를 결제하거나(전체 반려) 환불액에서 차감하거나(일부 반려) 교환 선결제분으로 충당한다.
 */
const PAYMENT_METHODS: PaymentMethods = {
  cardIssuers: ["SHINHAN", "SAMSUNG", "HYUNDAI", "KB", "LOTTE", "HANA", "BC", "NH", "WOORI"],
  easyPayProviders: ["KAKAOPAY", "NAVERPAY", "TOSSPAY"],
};

const REJECTED_PHASES: Array<UserClaimPhase> = [
  "REJECTED_WAITING",
  "REJECTED_PAY",
  "REJECTED_PREPARING",
  "REJECTED_RESHIPPING",
  "REJECTED_DONE",
  "REJECTED_DISPOSED",
];

export default function ClaimDetailView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CLAIM_DETAIL>>();
  const { claimId } = params;
  const { data: detail, isLoading, refetch } = useGetClaimDetail(claimId);
  const { show: showModal } = useModal();
  const { open } = useOrderNavigation();
  const [payment, setPayment] = useState<Partial<PaymentSelection>>({});
  const [isPaying, setIsPaying] = useState(false);

  // 송장 등록 · 배송지 변경 뒤 돌아오면 다시 읽는다
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const handlePaymentOutcome = useCallback(
    (outcome: ClaimPaymentOutcome) => {
      if (outcome.type === "PAID") {
        toast.show("결제가 완료되었어요. 반려 상품을 다시 보내드릴게요");
        invalidateOrderQueries();
        return;
      }
      if (outcome.type === "CANCELLED") {
        showModal({
          title: "결제가 취소되었어요",
          message: "결제가 자동으로 취소되었어요. 결제 금액은 자동으로 환불돼요.",
          buttons: [{ label: "확인" }],
        });
        void refetch();
        return;
      }
      toast.show("결제가 완료되지 않았어요. 다시 시도해 주세요.");
    },
    [refetch, showModal]
  );

  const claimPayment = useClaimPayment({ onOutcome: handlePaymentOutcome });

  const handlePressWithdraw = useCallback(
    (target: ClaimDetailItem) => {
      if (!detail) {
        return;
      }
      const isExchange = detail.type === "EXCHANGE";
      const paid = detail.exchangePayment?.paidAmount ?? 0;

      showModal({
        title: `${isExchange ? "교환" : "반품"} 요청을 철회할까요?`,
        message:
          isExchange && paid > 0
            ? `결제한 재발송 배송비 ${won(paid)}은\n결제 취소되고, 상품은 배송완료로 돌아가요.`
            : "철회하면 이 상품은 다시\n배송완료 상태로 돌아가요.",
        buttons: [
          { label: "닫기", variant: "outline" },
          {
            label: "철회하기",
            onPress: async () => {
              try {
                await claimService.withdraw(target.claimId);
                toast.show("요청을 철회했어요");
                invalidateOrderQueries();
                navigation.replace(COMMON_ROUTES.ORDER_DETAIL, { orderId: detail.orderId });
              } catch (error) {
                toast.show(resolveErrorMessage(error, "요청을 철회하지 못했어요"));
                void refetch();
              }
            },
          },
        ],
      });
    },
    [detail, navigation, refetch, showModal]
  );

  const handleItemAction = useCallback(
    (item: ClaimDetailItem, action: ClaimAction) => {
      if (!detail) {
        return;
      }
      switch (action.type) {
        case "WITHDRAW":
          handlePressWithdraw(item);
          return;
        case "REGISTER_COLLECTION_INVOICE":
          navigation.navigate(COMMON_ROUTES.CLAIM_INVOICE, { claimId: item.claimId });
          return;
        case "TRACK_COLLECTION":
          open(COMMON_ROUTES.COLLECTION_TRACKING, { claimId: item.claimId });
          return;
        case "TRACK_RESHIP":
          open(COMMON_ROUTES.DELIVERY_TRACKING, { reshipClaimId: item.claimId });
          return;
        case "INQUIRY":
          open(COMMON_ROUTES.INQUIRY_REGISTER, { orderId: detail.orderId, orderNumber: detail.orderNumber });
      }
    },
    [detail, handlePressWithdraw, navigation, open]
  );

  const handleChangeReshipAddress = useCallback(() => {
    if (!detail) {
      return;
    }
    navigation.navigate(COMMON_ROUTES.ADDRESS_SELECT, {
      onSelect: async address => {
        try {
          const updated = await claimService.changeReshipAddress(claimId, address.id);

          queryClient.setQueryData([ORDER_QUERY_KEY.CLAIM_DETAIL, claimId], updated);
          toast.show("교환받을 배송지를 변경했어요");
          return true;
        } catch (error) {
          toast.show(resolveErrorMessage(error, "배송지를 변경하지 못했어요"));
          void refetch();
          return true;
        }
      },
    });
  }, [claimId, detail, navigation, refetch]);

  const reshipFee = detail?.reshipFee;
  const isPayable = reshipFee?.state === "PAYABLE";
  const canPay = isPayable && isPaymentSelectionComplete(payment);

  const handlePressPay = useCallback(async () => {
    if (!reshipFee || !canPay || isPaying) {
      return;
    }
    setIsPaying(true);
    try {
      const paymentWindow = await claimService.payReshipFee(claimId, {
        ...(payment as PaymentSelection),
        expectedAmount: reshipFee.amount ?? undefined,
      });

      claimPayment.openPaymentWindow(paymentWindow);
    } catch (error) {
      toast.show(resolveErrorMessage(error, "결제를 시작하지 못했어요. 잠시 후 다시 시도해 주세요."));
      void refetch();
    } finally {
      setIsPaying(false);
    }
  }, [canPay, claimId, claimPayment, isPaying, payment, refetch, reshipFee]);

  if (isLoading || !detail) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="반품 · 교환 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const isExchange = detail.type === "EXCHANGE";
  const kw = isExchange ? "교환" : "반품";

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={`${kw} 상세`} onPressBack={navigation.goBack} />

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

        <SectionTitle title={`${kw} 상품`} count={`${detail.items.length}개`} />

        {detail.guide.visible && <GuideBox detail={detail} />}

        {detail.items.map((item, ix) => (
          <ClaimItemBlock
            key={item.claimId}
            item={item}
            isExchange={isExchange}
            showDivider={ix > 0}
            onPressAction={action => handleItemAction(item, action)}
          />
        ))}

        {!!reshipFee && reshipFee.state !== "WAITING" && (
          <ReshipFeeBlock
            reshipFee={reshipFee}
            kw={kw}
            phases={detail.items.map(item => item.phase)}
            payment={payment}
            onChangePayment={setPayment}
          />
        )}

        <Band marginTop={20} />
        <SectionTitle title={`${kw} 신청 정보`} style={{ paddingBottom: 8 }} />
        <View className="px-14">
          <InfoRow label="신청 일시" value={formatDateTimeFull(detail.requestedAt)} />
          <InfoRow
            label="완료 일시"
            value={
              detail.completedAt
                ? formatDateTimeFull(detail.completedAt)
                : `${isExchange ? "새 상품 도착" : "검수"} 후 표시돼요`
            }
            valueColor={detail.completedAt ? "#0F0F0F" : "#9E9E9E"}
          />
          {!!purchaseConfirmLine(detail) && (
            <InfoRow label="구매확정" value={purchaseConfirmLine(detail) as string} />
          )}
          <InfoRow label={`${kw} 사유`} value={detail.info.reasonLabel} />
          <InfoRow label={`${kw} 방법`} value={detail.info.methodLabel} />
          <InfoRow
            label="회수 송장"
            value={
              detail.info.collectionInvoice
                ? `${detail.info.collectionInvoice.carrierLabel} ${detail.info.collectionInvoice.trackingNumber}`
                : `미등록 · ${formatDueDate(detail.info.invoiceDueDate)}까지 등록해 주세요`
            }
            valueColor={detail.info.collectionInvoice ? "#0F0F0F" : "#CF3D61"}
          />
          {!!detail.info.reshipInvoice && (
            <InfoRow
              label="재발송 송장"
              value={`${detail.info.reshipInvoice.carrierLabel} ${detail.info.reshipInvoice.trackingNumber}`}
            />
          )}
          {!isExchange && !!detail.info.pickupFrom && (
            <InfoRow label="반품 수거지" value={maskedLines(detail.info.pickupFrom)} />
          )}
          <InfoRow
            label={`${kw} 도착지`}
            value={`${detail.info.returnTo.name} / ${detail.info.returnTo.contact}\n${detail.info.returnTo.address}${
              detail.info.returnTo.detailAddress ? ` ${detail.info.returnTo.detailAddress}` : ""
            }`}
          />
          {isExchange && !!detail.info.reshipTo && (
            <InfoRow label="교환받을 배송지" value={maskedLines(detail.info.reshipTo)}>
              {detail.info.reshipAddressChangeable && (
                <View className="flex-row" style={{ marginTop: 4 }}>
                  <UnderlineLink label="배송지 변경" onPress={handleChangeReshipAddress} />
                </View>
              )}
            </InfoRow>
          )}
        </View>

        <Band marginTop={14} />
        {!!detail.refund && <RefundSection detail={detail} />}
        {!detail.refund && !!detail.exchangePayment && (
          <>
            <SectionTitle title="결제 정보" />
            <View className="px-14 pt-14">
              <AmountRow
                label="재발송 배송비"
                value={won(detail.exchangePayment.reshipFee)}
                labelColor="#3C3C3C"
                fontSize={13.5}
              />
            </View>
            <View
              className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
              style={{ marginTop: 12, paddingTop: 12, gap: 12 }}
            >
              <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
                결제 금액
              </Typography>
              <Typography
                style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
                className="text-ink"
              >
                {won(detail.exchangePayment.paidAmount)}
              </Typography>
            </View>
            <View className="px-14 pt-9">
              <AmountRow
                label="결제 수단"
                value={detail.exchangePayment.methodLabel}
                fontSize={12.5}
                valueColor="#3C3C3C"
              />
            </View>
            <BulletNotes
              style={{ paddingHorizontal: 14, paddingTop: 18, paddingBottom: 26 }}
              notes={[
                "반송 택배비는 보내실 때 택배사에 직접 결제해요. 앱에서는 새 상품을 보내는 재발송 배송비만 결제돼요.",
                "요청을 철회하거나 검수에서 브랜드 귀책으로 확인되면 재발송 배송비는 결제 취소돼요.",
              ]}
            />
          </>
        )}
        {!detail.refund && !detail.exchangePayment && <View className="h-26" />}
      </ScrollView>

      {isPayable && (
        <BottomCta
          label={canPay ? `${won(reshipFee?.amount ?? 0)} 결제하고 다시 받기` : "결제 수단을 선택해 주세요"}
          enabled={!!canPay}
          loading={isPaying || claimPayment.isConfirming}
          onPress={handlePressPay}
        />
      )}

      <PortOnePaymentModal
        payment={claimPayment.paymentWindow}
        onComplete={paymentId => void claimPayment.confirm(paymentId)}
        onClose={paymentId => void claimPayment.confirm(paymentId)}
        onError={() => {
          claimPayment.openPaymentWindow(null);
          toast.show("결제창을 열지 못했어요. 다시 시도해 주세요.");
        }}
      />
    </View>
  );
}

/** 마스킹된 주소 두 줄 — 「김수* / 010-****-5678」 + 주소 */
function maskedLines(address: MaskedAddress) {
  return `${address.recipientName} / ${address.phoneNumber}\n${address.address}${
    address.detailAddress ? ` ${address.detailAddress}` : ""
  }`;
}

/**
 * 구매확정 줄 — 반품·교환을 요청하면 그 항목의 구매확정 타이머가 멈춘다(결정 7).
 * 교환 완료면 7일이 새로 시작하고, 반품 완료면 해당 없다. 거절된 요청은 보류를 풀므로(서버 2026-10-05)
 * 반려 단계에서는 줄을 그리지 않는다 — 「일시 정지」라고 쓰면 거짓이 된다.
 */
function purchaseConfirmLine(detail: ClaimDetailResponse): string | null {
  const focused = detail.items.find(item => item.focused) ?? detail.items[0];

  if (!focused || focused.phase === "CANCELLED" || REJECTED_PHASES.includes(focused.phase)) {
    return null;
  }
  const kw = detail.type === "EXCHANGE" ? "교환" : "반품";

  if (focused.phase === "DONE") {
    return detail.type === "EXCHANGE" ? "교환 완료일부터 7일 새로 시작" : "반품 완료 · 해당 없음";
  }
  return `${kw} 처리 중 · 구매확정 일시 정지`;
}

function GuideBox(props: { detail: ClaimDetailResponse }) {
  const { detail } = props;
  const isCollect = detail.guide.courierPayment === "COLLECT";
  const line = (before: string, strong: string, after: string) => (
    <Typography style={{ fontSize: 12.5, lineHeight: 20.6 }} className="text-ink76">
      {before}
      <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20.6 }} className="text-ink76">
        {strong}
      </Typography>
      {after}
    </Typography>
  );

  const lines =
    detail.type === "EXCHANGE"
      ? [
          line(
            "가까운 택배사에 ",
            isCollect ? "착불로 접수" : "선불로 접수",
            `한 뒤 회수 송장을 등록해 주세요.${
              isCollect ? " 택배비는 브랜드가 부담해요." : " 반송 택배비는 택배사에 직접 결제해요."
            }`
          ),
          "상품이 도착해 검수를 마치면 새 상품이 출발해요.",
          "이 상품만 한 박스에 포장해 주세요. 다른 반품·교환 상품은 함께 넣지 마세요.",
        ]
      : [
          line("가까운 택배사에 접수한 뒤 ", "회수 송장을 등록", "해 주세요. 등록해야 회수 상황이 추적돼요."),
          "이 상품만 한 박스에 포장해 주세요. 다른 반품·교환 상품은 함께 넣지 마세요.",
          "브랜드가 받아 검수를 마치면 환불되고, 알림으로 알려드려요.",
        ];

  return <CautionBox style={{ marginTop: 14 }} lines={lines} />;
}

function ClaimItemBlock(props: {
  item: ClaimDetailItem;
  isExchange: boolean;
  showDivider: boolean;
  onPressAction: (action: ClaimAction) => void;
}) {
  const { item, isExchange, showDivider, onPressAction } = props;

  return (
    <View>
      {showDivider && (
        <View className="mx-14 border-t-[0.5px] border-dividerProduct" style={{ marginTop: 18 }} />
      )}
      <View className="flex-row items-center px-14 pt-16" style={{ gap: 6 }}>
        <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 16.25 }} className="text-ink">
          {item.statusLabel}
        </Typography>
        {!!item.statusSub && (
          <Typography
            style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 16.25 }}
            className={`min-w-0 flex-1 ${item.statusSubTone === "ACTIVE" ? "text-roseText" : "text-gray45"}`}
          >
            {item.statusSub}
          </Typography>
        )}
      </View>
      <View className="px-14 pt-12">
        <ProductBlock
          thumbnailUrl={item.thumbnailUrl}
          brand={item.brandName}
          name={item.productName}
          meta={`${item.optionName} / ${item.quantity}개`}
          newMeta={
            isExchange && item.exchangeOptionName ? `${item.exchangeOptionName} / ${item.quantity}개` : null
          }
          price={won(item.amount)}
        />
      </View>
      {item.actions.length > 0 && (
        <View className="flex-row px-14 pt-14" style={{ gap: 7 }}>
          {item.actions.map(action => (
            <OutlineAction
              key={action.type}
              label={action.label}
              height={44}
              fontSize={13}
              onPress={() => onPressAction(action)}
            />
          ))}
        </View>
      )}
      {!!item.rejection && <RejectionBlock item={item} />}
    </View>
  );
}

/** 반려 사유 — 사유 · 법적 근거 · 브랜드 증빙 사진 · 브랜드 메시지(출처를 밝혀 본문과 분리) */
function RejectionBlock(props: { item: ClaimDetailItem }) {
  const { item } = props;
  const rejection = item.rejection!;

  return (
    <View className="mx-14 rounded-base bg-band p-14" style={{ marginTop: 16 }}>
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink">
        반려 사유
      </Typography>
      <Typography
        style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 20.9, marginTop: 9 }}
        className="text-ink"
      >
        {rejection.reasonLabel}
      </Typography>
      {!!rejection.legalNote && (
        <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 4 }} className="text-gray45">
          {rejection.legalNote}
        </Typography>
      )}
      {rejection.evidenceImageUrls.length > 0 && (
        <>
          <View className="flex-row flex-wrap" style={{ marginTop: 12, gap: 8 }}>
            {rejection.evidenceImageUrls.map(url => (
              <Image key={url} source={{ uri: url }} style={{ width: 64, height: 64, borderRadius: 4 }} />
            ))}
          </View>
          <Typography style={{ fontSize: 11.5, lineHeight: 17.25, marginTop: 7 }} className="text-gray45">
            브랜드가 입고 검수 때 촬영한 사진이에요
          </Typography>
        </>
      )}
      {!!rejection.sellerMessage && (
        <View
          className="rounded-base bg-white"
          style={{ marginTop: 12, paddingVertical: 11, paddingHorizontal: 12 }}
        >
          <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
            {item.brandName}의 메시지
          </Typography>
          <Typography style={{ fontSize: 12.5, lineHeight: 20.6, marginTop: 7 }} className="text-ink76">
            {rejection.sellerMessage}
          </Typography>
        </View>
      )}
    </View>
  );
}

/** 「상품 다시 받기」 — 결제 필요 · 차감 · 충당 · 결제 완료 */
function ReshipFeeBlock(props: {
  reshipFee: ClaimReshipFee;
  kw: string;
  phases: Array<UserClaimPhase>;
  payment: Partial<PaymentSelection>;
  onChangePayment: (next: Partial<PaymentSelection>) => void;
}) {
  const { reshipFee, kw, phases, payment, onChangePayment } = props;
  const amount = won(reshipFee.amount ?? 0);

  const confirmBox = (title: string, sub: string) => (
    <View
      className="mx-14 flex-row items-start rounded-base border-[1px] border-borderButton px-14 py-13"
      style={{ marginTop: 10, gap: 10 }}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
        <Path
          d="M4.5 12.5l5 5 10-11"
          stroke="#3C3C3C"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <View className="min-w-0 flex-1">
        <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 20.25 }} className="text-ink">
          {title}
        </Typography>
        <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 4 }} className="text-gray45">
          {sub}
        </Typography>
      </View>
    </View>
  );

  return (
    <View>
      <SectionTitle title="상품 다시 받기" />
      {reshipFee.state === "PAYABLE" && (
        <>
          <Typography style={{ fontSize: 12.5, lineHeight: 20.6 }} className="px-14 pt-8 text-ink76">
            {kw}이 반려된 상품을 다시 보내드려요.{" "}
            {!!reshipFee.dueDate && (
              <Typography
                style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20.6 }}
                className="text-ink76"
              >
                {formatDueDate(reshipFee.dueDate)}까지
              </Typography>
            )}
            {reshipFee.dueDate ? " " : ""}재발송 배송비를 결제해 주세요.
          </Typography>
          <View className="flex-row items-baseline justify-between px-14 pt-12" style={{ gap: 12 }}>
            <Typography style={{ fontSize: 13.5, lineHeight: 18.9 }} className="text-ink76">
              재발송 배송비
            </Typography>
            <Typography style={{ fontSize: 15, fontWeight: "700", lineHeight: 21 }} className="text-ink">
              {amount}
            </Typography>
          </View>
          <PaymentMethodPicker
            sheetId="claim-reship-card-issuer"
            methods={PAYMENT_METHODS}
            value={payment}
            onChange={onChangePayment}
            issuerSheet="grid"
            easyPayLabelSize={14.5}
          />
          {(!!reshipFee.storage?.storageDueAt || !!reshipFee.dueDate) && (
            <Typography style={{ fontSize: 11.5, lineHeight: 18.4 }} className="px-14 pt-10 text-gray45">
              보관 기한{" "}
              <Typography
                style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 18.4 }}
                className="text-ink76"
              >
                {formatMonthDay(reshipFee.storage?.storageDueAt ?? reshipFee.dueDate)}
              </Typography>{" "}
              · 이후 처리는 고객센터로 안내드려요.
            </Typography>
          )}
        </>
      )}
      {reshipFee.state === "DEDUCTED" &&
        confirmBox(
          `함께 반품한 상품의 환불액에서 재발송 배송비 ${amount}을 빼고 보내드려요`,
          "반품이 승인된 상품의 환불액에서 차감돼요. 추가 결제는 없어요."
        )}
      {reshipFee.state === "COVERED" &&
        confirmBox(
          "요청 때 결제한 배송비로 다시 보내드려요",
          "새 상품 대신 받으신 상품을 그대로 돌려보내요. 추가 결제는 없어요."
        )}
      {reshipFee.state === "PAID" &&
        confirmBox(
          paidReshipTitle(phases),
          `재발송 배송비 ${amount} · ${reshipFee.methodLabel ?? ""} 결제 완료${
            reshipFee.settledAt ? ` (${formatMonthDay(reshipFee.settledAt)})` : ""
          }`
        )}
    </View>
  );
}

function RefundSection(props: { detail: ClaimDetailResponse }) {
  const refund = props.detail.refund!;
  const hasRejected =
    refund.rejectedAmount !== null && refund.rejectedAmount !== undefined && refund.rejectedAmount > 0;

  return (
    <>
      <SectionTitle title="환불 정보" />
      <View className="px-14 pt-14" style={{ gap: 9 }}>
        {hasRejected && (
          <AmountRow
            label="반려 상품 금액 (환불 제외)"
            value={won(refund.rejectedAmount as number)}
            labelColor="#3C3C3C"
            valueColor="#9E9E9E"
            fontSize={13.5}
            strike
          />
        )}
        <AmountRow
          label={hasRejected ? "승인 상품 금액" : "결제 금액"}
          value={won(refund.approvedAmount)}
          labelColor="#3C3C3C"
          fontSize={13.5}
        />
        {refund.returnDeduction > 0 && (
          <AmountRow
            label="반품 배송비 (차감)"
            value={`-${won(refund.returnDeduction)}`}
            labelColor="#3C3C3C"
            valueColor="#CF3D61"
            fontSize={13.5}
          />
        )}
        {refund.reshipDeduction > 0 && (
          <AmountRow
            label="재발송 배송비 (차감)"
            value={`-${won(refund.reshipDeduction)}`}
            labelColor="#3C3C3C"
            valueColor="#CF3D61"
            fontSize={13.5}
          />
        )}
      </View>
      <View
        className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
        style={{ marginTop: 12, paddingTop: 12, gap: 12 }}
      >
        <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
          {refund.confirmed ? "환불 금액" : "환불 예정 금액"}
        </Typography>
        <Typography
          style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
          className={refund.amount === 0 ? "text-gray62" : "text-ink"}
        >
          {won(refund.amount)}
        </Typography>
      </View>
      {!!refund.refundMethodLabel && (
        <View className="px-14 pt-9">
          <AmountRow
            label="환불 수단"
            value={refund.refundMethodLabel}
            fontSize={12.5}
            valueColor="#3C3C3C"
          />
        </View>
      )}
      <BulletNotes
        style={{ paddingHorizontal: 14, paddingTop: 18, paddingBottom: 26 }}
        notes={
          refund.returnDeduction > 0
            ? [
                `무료배송으로 받은 주문을 단순 변심으로 반품하면 최초 배송비 ${won(refund.returnDeduction)}이 차감돼요.`,
              ]
            : ["환불은 검수 완료 후 영업일 3–5일 안에 결제 수단으로 돌아가요."]
        }
      />
    </>
  );
}

/** 반려 재발송비를 낸 뒤 — 받았으면 종결, 출발했으면 이동 중, 아니면 준비 중 */
function paidReshipTitle(phases: Array<UserClaimPhase>) {
  if (phases.includes("REJECTED_DONE")) {
    return "반려 상품을 받으셨어요";
  }
  if (phases.includes("REJECTED_RESHIPPING")) {
    return "반려 상품을 다시 보내드렸어요";
  }
  return "반려 상품을 다시 보내드릴게요";
}
