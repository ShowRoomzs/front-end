import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import { CheckIcon } from "@/common/components/DsIcon/icons";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Stepper from "@/common/components/Stepper/Stepper";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { cartService } from "@/features/cart/services/cartService";
import {
  AmountRow,
  Band,
  BottomCta,
  BulletNotes,
  CloseHeader,
  OutlineAction,
  ProductBlock,
  ProductLine,
  RoundCheck,
  SectionTitle,
} from "@/features/order/components/OrderParts/OrderParts";
import { RadioDot } from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";
import { useGetOrderDetail } from "@/features/order/hooks/useOrderQueries";
import { cancelRequestService } from "@/features/order/services/cancelRequestService";
import { CANCEL_REQUEST_REASONS, CancelRequestReason } from "@/features/order/types/cancelRequest";
import { formatOrderDate, resolveErrorMessage, won } from "@/features/order/utils/orderFormat";

/**
 * C10 1c 주문 취소 요청 — 상품준비중은 즉시 취소가 아니라 **요청**이다.
 *
 * 브랜드가 포장·출고를 시작한 뒤라 브랜드 승인으로 확정되고, 그사이 발송되면 거절된다. 화면은
 * 결제완료 즉시 취소(1b)와 같고 달라지는 곳은 세 군데뿐이다 — 안내 첫 줄(이미 발송되면 거절될 수
 * 있다) · 버튼 「취소 요청하기」 · 완료 제목 「취소 요청이 접수되었어요」. 「완료」라고 쓰면
 * 거절됐을 때 약속을 어긴 셈이 되므로 끝까지 「요청」으로 표현한다.
 *
 * 상품이 여럿이면 **체크로 고르고**, 2개 이상 수량이면 취소 수량 스테퍼가 붙는다. 진입한 항목은
 * 미리 체크된다. 상품이 1개면 고를 것이 없어 체크박스를 두지 않는다.
 *
 * ⚠️ 앱용 취소 요청 API가 없어 DEV에서만 목업으로 동작한다(`cancelRequestService`).
 */
interface Line {
  orderProductId: number;
  productId: number;
  variantId: number;
  groupBuyId: number | null;
  brand: string;
  productName: string;
  optionName: string;
  thumbnailUrl: string;
  unit: number;
  max: number;
  shipping: { deliveryFee: number; groupKey: string };
}

export default function CancelRequestView() {
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CANCEL_REQUEST>>();
  const { data: order, isLoading } = useGetOrderDetail(params.orderId);

  /** 취소 요청 대상 — 이 주문의 상품준비중 항목 */
  const lines = useMemo<Array<Line>>(() => {
    if (!order) {
      return [];
    }
    return order.items
      .filter(item => item.status === "PREPARING")
      .map(item => {
        const group = order.groups.find(candidate =>
          candidate.items.some(groupItem => groupItem.orderProductId === item.orderProductId)
        );

        return {
          orderProductId: item.orderProductId,
          productId: item.productId,
          variantId: item.variantId,
          groupBuyId: group?.groupBuyId ?? null,
          brand: item.brandName ?? "",
          productName: item.productName,
          optionName: item.optionName,
          thumbnailUrl: item.thumbnailUrl,
          unit: Math.round(item.amount / Math.max(1, item.quantity)),
          max: item.quantity,
          shipping: {
            deliveryFee: group?.shipping.deliveryFee ?? 0,
            groupKey: String(group?.groupBuyId ?? ""),
          },
        };
      });
  }, [order]);

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [reason, setReason] = useState<CancelRequestReason | null>(null);
  const [etcText, setEtcText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [recart, setRecart] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState<{ cancelRequestId: number; recarted: boolean } | null>(null);

  useEffect(() => {
    if (lines.length === 0) {
      return;
    }
    const initial: Record<number, boolean> = {};

    lines.forEach(line => {
      initial[line.orderProductId] = lines.length === 1 || line.orderProductId === params.orderProductId;
    });
    setChecked(initial);
    setQuantities(Object.fromEntries(lines.map(line => [line.orderProductId, line.max])));
  }, [lines, params.orderProductId]);

  const isMulti = lines.length > 1;
  const selectedLines = lines.filter(line => checked[line.orderProductId]);
  const qtyOf = (line: Line) => Math.min(quantities[line.orderProductId] ?? line.max, line.max);
  const cancelSum = selectedLines.reduce((sum, line) => sum + line.unit * qtyOf(line), 0);

  /**
   * 배송비 — 그룹(브랜드) 전체를 취소하면 그 배송비도 함께 돌아가고, 일부만 취소하면 남은 상품이
   * 그대로 배송되므로 돌려주지 않는다. 확정 후에 알게 되면 분쟁이 되므로 줄에 미리 적는다.
   */
  const shipping = useMemo(() => {
    const groups = new Map<string, { fee: number; total: number; cancelled: number }>();

    lines.forEach(line => {
      const entry = groups.get(line.shipping.groupKey) ?? {
        fee: line.shipping.deliveryFee,
        total: 0,
        cancelled: 0,
      };

      entry.total += line.unit * line.max;
      if (checked[line.orderProductId]) {
        entry.cancelled += line.unit * qtyOf(line);
      }
      groups.set(line.shipping.groupKey, entry);
    });

    let refund = 0;
    let hasPartialPaid = false;
    let hasPaid = false;

    groups.forEach(group => {
      if (group.cancelled === 0) {
        return;
      }
      hasPaid = hasPaid || group.fee > 0;
      if (group.cancelled >= group.total) {
        refund += group.fee;
      } else if (group.fee > 0) {
        hasPartialPaid = true;
      }
    });

    let line = "무료배송 주문 · 환불 없음";

    if (refund > 0) {
      line = `+${won(refund)} 함께 환불`;
    } else if (hasPartialPaid) {
      line = "남은 상품 배송에 쓰여 환불 없음";
    } else if (!hasPaid && cancelSum > 0) {
      line = "무료배송 주문";
    }
    return { refund, line };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, lines, quantities]);

  const refund = cancelSum + shipping.refund;
  const isAllSelected = lines.length > 0 && selectedLines.length === lines.length;
  const isReady = selectedLines.length > 0 && !!reason;

  const ctaLabel = (() => {
    if (selectedLines.length === 0) {
      return "취소할 상품을 선택해 주세요";
    }
    return reason ? `취소 요청하기 (${selectedLines.length}개)` : "취소 사유를 선택해 주세요";
  })();

  const handleSubmit = useCallback(async () => {
    if (!order || !reason || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { cancelRequestId } = await cancelRequestService.create({
        orderId: order.orderId,
        items: selectedLines.map(line => ({ orderProductId: line.orderProductId, quantity: qtyOf(line) })),
        reason,
        reasonDetail: reason === "ETC" ? etcText.trim() || undefined : undefined,
      });

      let recarted = false;

      if (recart) {
        const results = await Promise.allSettled(
          selectedLines
            .filter(line => !!line.groupBuyId)
            .map(line =>
              cartService.create([
                {
                  productId: line.productId,
                  variantId: line.variantId,
                  groupBuyId: line.groupBuyId as number,
                  quantity: qtyOf(line),
                },
              ])
            )
        );

        recarted = results.some(result => result.status === "fulfilled");
      }
      setIsConfirmOpen(false);
      setDone({ cancelRequestId, recarted });
    } catch (error) {
      setIsConfirmOpen(false);
      toast.show(resolveErrorMessage(error, (error as Error)?.message || "취소를 요청하지 못했어요."));
    } finally {
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etcText, isSubmitting, order, reason, recart, selectedLines]);

  if (isLoading || !order) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="주문 취소" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  if (done) {
    return (
      <View className="flex-1 bg-white">
        <CloseHeader title="주문 취소" onClose={navigation.goBack} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-14" style={{ paddingTop: 24, paddingBottom: 20 }}>
            <Typography
              style={{ fontSize: 19, fontWeight: "700", lineHeight: 27.55, letterSpacing: -0.4 }}
              className="text-ink"
            >
              취소 요청이 접수되었어요
            </Typography>
            <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 6 }} className="text-gray45">
              브랜드가 확인하면 취소가 완료되고 알림으로 알려드려요.
            </Typography>
            <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 4 }} className="text-gray45">
              취소 요청이 처리될 때까지 이 주문의 상품은 발송되지 않아요.
            </Typography>
            {done.recarted && (
              <View className="flex-row items-center" style={{ marginTop: 12, gap: 6 }}>
                <CheckIcon size={15} color="#3C3C3C" />
                <Typography
                  style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 17.5 }}
                  className="text-ink76"
                >
                  취소한 상품을 장바구니에 다시 담았어요
                </Typography>
              </View>
            )}
          </View>

          <Band />
          <SectionTitle title="환불 정보" />
          <View className="px-14 pt-14">
            <AmountRow label="취소 상품 금액" value={won(cancelSum)} labelColor="#3C3C3C" fontSize={13.5} />
          </View>
          <View
            className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
            style={{ marginTop: 10, paddingTop: 12, gap: 12 }}
          >
            <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
              환불 예정 금액
            </Typography>
            <Typography
              style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
              className="text-ink"
            >
              {won(refund)}
            </Typography>
          </View>
          {!!order.payment && (
            <View className="px-14 pt-9">
              <AmountRow
                label="환불 수단"
                value={order.payment.methodLabel}
                fontSize={12.5}
                valueColor="#3C3C3C"
              />
            </View>
          )}

          <Band marginTop={18} />
          <SectionTitle title="취소 상품" count={`${selectedLines.length}개`} style={{ paddingBottom: 4 }} />
          {selectedLines.map(line => (
            <View key={line.orderProductId} className="px-14 pt-12">
              <ProductBlock
                thumbnailUrl={line.thumbnailUrl}
                brand={line.brand}
                name={line.productName}
                meta={`${line.optionName} / ${qtyOf(line)}개`}
                price={won(line.unit * qtyOf(line))}
              />
            </View>
          ))}
          <View className="flex-row px-14 pt-16" style={{ gap: 8 }}>
            <OutlineAction
              label="취소 상세"
              height={44}
              fontSize={13.5}
              onPress={() =>
                navigation.replace(COMMON_ROUTES.CANCEL_DETAIL, { cancelRequestId: done.cancelRequestId })
              }
            />
            <OutlineAction
              label="주문 내역으로"
              height={44}
              fontSize={13.5}
              onPress={() => mainNavigation.navigate(ROOT_ROUTES.HOME)}
            />
          </View>
          <BulletNotes
            style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 26 }}
            notes={[
              "브랜드가 이미 발송한 경우 취소 요청이 거절될 수 있어요.",
              "결제 수단별로 환불에 2~3영업일이 더 걸릴 수 있어요.",
            ]}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="주문 취소" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {isMulti ? (
          <View
            className="flex-row items-center justify-between px-14"
            style={{ paddingTop: 16, paddingBottom: 2 }}
          >
            <TouchableOpacity
              onPress={() =>
                setChecked(Object.fromEntries(lines.map(line => [line.orderProductId, !isAllSelected])))
              }
              activeOpacity={0.55}
              className="flex-row items-center"
              style={{ gap: 10, padding: 11, margin: -11 }}
            >
              <RoundCheck isChecked={isAllSelected} />
              <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
                전체 선택
              </Typography>
            </TouchableOpacity>
            <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
              {formatOrderDate(order.orderedAt)} 주문
            </Typography>
          </View>
        ) : (
          <SectionTitle
            title="취소할 상품"
            right={
              <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
                {formatOrderDate(order.orderedAt)} 주문
              </Typography>
            }
          />
        )}

        {lines.map((line, ix) => {
          const isChecked = !!checked[line.orderProductId];
          const quantity = qtyOf(line);

          return (
            <View
              key={line.orderProductId}
              className="px-14 pt-14"
              style={ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : undefined}
            >
              <View className="flex-row items-start" style={{ gap: 10 }}>
                {isMulti && (
                  <TouchableOpacity
                    onPress={() => setChecked(prev => ({ ...prev, [line.orderProductId]: !isChecked }))}
                    activeOpacity={0.55}
                    style={{ padding: 11, margin: -11, marginRight: -1 }}
                  >
                    <RoundCheck isChecked={isChecked} />
                  </TouchableOpacity>
                )}
                <View className="min-w-0 flex-1">
                  <ProductLine
                    thumbnailUrl={line.thumbnailUrl}
                    brand={line.brand}
                    name={line.productName}
                    option={`${line.optionName} · 주문 ${line.max}개`}
                    price={won(line.unit * (isChecked ? quantity : line.max))}
                    dimmed={!isChecked}
                  />
                </View>
              </View>
              {isChecked && line.max > 1 && (
                <View
                  className="flex-row items-center justify-between"
                  style={{ paddingTop: 12, paddingLeft: isMulti ? 31 : 0, gap: 10 }}
                >
                  <Typography
                    style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 12.5 }}
                    className="text-ink76"
                  >
                    취소 수량
                  </Typography>
                  <Stepper
                    size="md"
                    value={quantity}
                    min={1}
                    max={line.max}
                    onChange={value => setQuantities(prev => ({ ...prev, [line.orderProductId]: value }))}
                  />
                </View>
              )}
              <View className="h-14" />
            </View>
          );
        })}

        <Band marginTop={6} />

        <SectionTitle title="취소 사유" />
        <View className="px-14" style={{ marginTop: 6 }}>
          {CANCEL_REQUEST_REASONS.map(option => {
            const isSelected = reason === option.code;

            return (
              <TouchableOpacity
                key={option.code}
                onPress={() => setReason(option.code)}
                activeOpacity={0.55}
                className="flex-row items-center"
                style={{ minHeight: 44, gap: 11 }}
              >
                <RadioDot isSelected={isSelected} />
                <Typography
                  style={{ fontSize: 14, fontWeight: isSelected ? "600" : "400", lineHeight: 20.3 }}
                  className={`min-w-0 flex-1 ${isSelected ? "text-ink" : "text-ink76"}`}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
          {reason === "ETC" && (
            <View
              className="rounded-base border-[1px] border-borderButton p-12"
              style={{ marginTop: 4, minHeight: 80 }}
            >
              <TextInput
                value={etcText}
                onChangeText={setEtcText}
                placeholder="취소 사유를 적어주세요"
                placeholderTextColor="#B5B5B5"
                multiline
                maxLength={255}
                className="m-0 flex-1 p-0 text-ink"
                style={{
                  fontSize: 13.5,
                  lineHeight: 22.3,
                  fontFamily: "Pretendard-Regular",
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}
        </View>

        <Band marginTop={20} />

        <SectionTitle title="환불 정보" />
        <View
          className="mx-14 flex-row items-baseline justify-between border-b-[0.5px] border-dividerProduct"
          style={{ marginTop: 14, paddingBottom: 14, gap: 12 }}
        >
          <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-ink">
            환불 예정 금액
          </Typography>
          <Typography
            style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
            className="text-ink"
          >
            {won(refund)}
          </Typography>
        </View>
        <View className="px-14 pt-8">
          <AmountRow label="배송비" fontSize={12.5} valueColor="#3C3C3C" value={shipping.line} />
        </View>
        <BulletNotes
          style={{ paddingHorizontal: 14, paddingTop: 16 }}
          notes={[
            "브랜드가 배송 준비를 시작해 이미 발송된 경우, 취소 요청이 거절되고 주문하신 상품을 받으실 수 있어요.",
            "결제 수단으로 결제 취소되며, 카드사 처리에 2~3영업일이 더 걸릴 수 있어요.",
          ]}
        />
        <View className="h-26" />
      </ScrollView>

      <BottomCta label={ctaLabel} enabled={isReady} onPress={() => setIsConfirmOpen(true)} />

      {isConfirmOpen && (
        <View
          className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 32, zIndex: 10 }}
        >
          <View className="w-full overflow-hidden rounded-base bg-white">
            <View style={{ paddingHorizontal: 22, paddingTop: 26, paddingBottom: 6 }}>
              <Typography
                style={{ fontSize: 16.5, fontWeight: "700", lineHeight: 24.75, letterSpacing: -0.3 }}
                className="text-center text-ink"
              >
                주문을 취소할까요?
              </Typography>
              <Typography
                style={{ fontSize: 13, lineHeight: 22.1, marginTop: 6 }}
                className="text-center text-gray45"
              >
                환불 예정 금액 {won(refund)}
              </Typography>
              <TouchableOpacity
                onPress={() => setRecart(prev => !prev)}
                activeOpacity={0.55}
                className="flex-row items-center justify-center"
                style={{ marginTop: 14, minHeight: 44, gap: 9 }}
              >
                <RoundCheck isChecked={recart} />
                <Typography style={{ fontSize: 14, lineHeight: 19.6 }} className="text-ink76">
                  장바구니에 다시 담기
                </Typography>
              </TouchableOpacity>
            </View>
            <View
              className="flex-row"
              style={{ gap: 8, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 18 }}
            >
              <TouchableOpacity
                onPress={() => setIsConfirmOpen(false)}
                activeOpacity={0.6}
                className="h-48 flex-1 items-center justify-center rounded-base border-[1px] border-borderButton bg-white"
              >
                <Typography
                  style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
                  className="text-ink76"
                >
                  닫기
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.75}
                className="h-48 flex-1 items-center justify-center rounded-base bg-rose"
                style={{ opacity: isSubmitting ? 0.75 : 1 }}
              >
                <Typography
                  style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
                  className="text-white"
                >
                  취소 요청하기
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
