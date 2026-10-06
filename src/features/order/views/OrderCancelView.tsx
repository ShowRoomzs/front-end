import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckIcon, CloseIcon } from "@/common/components/DsIcon/icons";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
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
  OutlineAction,
  ProductBlock,
  ProductLine,
  RoundCheck,
  SectionTitle,
} from "@/features/order/components/OrderParts/OrderParts";
import { RadioDot } from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";
import { invalidateOrderQueries, useGetOrderDetail } from "@/features/order/hooks/useOrderQueries";
import { orderService } from "@/features/order/services/orderService";
import { formatOrderDate, resolveErrorMessage, won } from "@/features/order/utils/orderFormat";

/**
 * C10 1b 주문 취소 — 결제완료(브랜드가 준비를 시작하기 전) 즉시 취소.
 *
 * 시안은 상품을 골라 일부만 취소하고 수량도 고르게 하지만, 서버의 소비자 취소는 **주문 전액**만
 * 받는다(부분 취소 · 수량 취소는 PG 부분 취소 모델이 없어 미정 — 서버 C10 설계서 7-2 C1·C2).
 * 그래서 시안의 「상품이 1개인 주문」 규칙을 모든 주문에 쓴다 — 고를 것이 없으므로 체크박스를
 * 두지 않고 「취소할 상품」 아래 목록만 보여준다. 풀 수 없는 체크를 두면 고장처럼 보인다.
 * 전액 취소라 배송비도 함께 돌아가고, 발송 전이라 공제는 없다.
 *
 * 확인 모달의 역할은 재확인보다 **「장바구니에 다시 담기」** — 취소 사유의 상당수가 옵션·수량
 * 실수나 결제 수단 변경이라 다시 담아 두면 재주문까지 한 번에 이어진다(기본 체크).
 */
const REASONS = [
  { value: "단순 변심", label: "단순 변심 (상품이 필요 없어졌어요)" },
  { value: "주문 실수", label: "주문 실수 (상품·옵션·수량을 잘못 골랐어요)" },
  { value: "다른 결제 수단으로 변경", label: "다른 결제 수단으로 변경" },
  { value: "기타", label: "기타" },
] as const;

type ReasonValue = (typeof REASONS)[number]["value"];

interface DoneState {
  /** 202 — PG 응답 지연. 실패가 아니라 「취소 처리 중」이다 */
  isPending: boolean;
  recarted: boolean;
}

export default function OrderCancelView() {
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.ORDER_CANCEL>>();
  const { data: order, isLoading } = useGetOrderDetail(params.orderId);

  const [reason, setReason] = useState<ReasonValue | null>(null);
  const [etcText, setEtcText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [recart, setRecart] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState<DoneState | null>(null);

  const items = useMemo(
    () =>
      (order?.groups ?? []).flatMap(group =>
        group.items.map(item => ({ ...item, brand: group.marketName, groupBuyId: group.groupBuyId }))
      ),
    [order?.groups]
  );

  const itemSum = order ? order.summary.totalAmount - order.summary.deliveryFeeTotal : 0;
  const refund = order?.summary.totalAmount ?? 0;
  const deliveryFee = order?.summary.deliveryFeeTotal ?? 0;

  /** 담기는 같은 공구로 다시 — 그사이 마감·품절된 상품은 서버가 막으므로 조용히 건너뛴다 */
  const putBackToCart = useCallback(async () => {
    const results = await Promise.allSettled(
      items
        .filter(item => !!item.groupBuyId)
        .map(item =>
          cartService.create([
            {
              productId: item.productId,
              variantId: item.variantId,
              groupBuyId: item.groupBuyId,
              quantity: item.quantity,
            },
          ])
        )
    );

    return results.some(result => result.status === "fulfilled");
  }, [items]);

  const handleSubmit = useCallback(async () => {
    if (!order || !reason || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const reasonText = reason === "기타" ? etcText.trim() || "기타" : reason;
      const result = await orderService.cancel(order.orderId, reasonText);
      const recarted = recart ? await putBackToCart() : false;

      invalidateOrderQueries({ includeCart: recarted });
      setIsConfirmOpen(false);
      setDone({ isPending: result.isPending, recarted });
    } catch (error) {
      setIsConfirmOpen(false);
      toast.show(resolveErrorMessage(error, "주문을 취소하지 못했어요. 고객센터로 문의해 주세요."));
      invalidateOrderQueries();
    } finally {
      setIsSubmitting(false);
    }
  }, [etcText, isSubmitting, order, putBackToCart, reason, recart]);

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
      <CancelDoneScreen
        isPending={done.isPending}
        recarted={done.recarted}
        itemSum={itemSum}
        refund={refund}
        refundMethod={order.payment?.methodLabel ?? ""}
        items={items}
        onClose={navigation.goBack}
        onPressOrderDetail={() => navigation.replace(COMMON_ROUTES.ORDER_DETAIL, { orderId: order.orderId })}
        // 공용 스택을 닫고 홈 탭으로 — 주문 내역에서 들어왔다면 그 화면이 그대로 남아 있다
        onPressOrderList={() => mainNavigation.navigate(ROOT_ROUTES.HOME)}
      />
    );
  }

  const canCancel = order.cancellable;
  const isReady = canCancel && !!reason;
  const ctaLabel = (() => {
    if (!canCancel) {
      return "지금은 바로 취소할 수 없는 주문이에요";
    }
    return reason ? `취소하기 (${items.length}개)` : "취소 사유를 선택해 주세요";
  })();

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="주문 취소" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SectionTitle
          title="취소할 상품"
          right={
            <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
              {formatOrderDate(order.orderedAt)} 주문
            </Typography>
          }
        />
        {items.map((item, ix) => (
          <View
            key={item.orderProductId ?? item.variantId}
            className="px-14 pt-14"
            style={ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : undefined}
          >
            <ProductLine
              thumbnailUrl={item.thumbnailUrl}
              brand={item.brand}
              name={item.productName}
              option={`${item.optionName} · 주문 ${item.quantity}개`}
              price={won(item.price.salePrice * item.quantity)}
            />
            <View className="h-14" />
          </View>
        ))}

        <Band marginTop={6} />

        <SectionTitle title="취소 사유" />
        <View className="px-14" style={{ marginTop: 6 }}>
          {REASONS.map(option => {
            const isSelected = reason === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => setReason(option.value)}
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
          {reason === "기타" && (
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
          <AmountRow
            label="배송비"
            fontSize={12.5}
            valueColor="#3C3C3C"
            value={deliveryFee > 0 ? `+${won(deliveryFee)} 함께 환불` : "무료배송 주문"}
          />
        </View>
        <BulletNotes
          style={{ paddingHorizontal: 14, paddingTop: 16 }}
          notes={["결제 수단으로 결제 취소되며, 카드사 처리에 2~3영업일이 더 걸릴 수 있어요."]}
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
            {/* 모달 안에서 「취소」가 두 번 나오면 어느 쪽이 주문 취소인지 헷갈려 닫기를 「닫기」로 둔다 */}
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
                  취소하기
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * 취소 완료 — 결제완료 단계는 브랜드가 아직 준비를 시작하지 않아 **즉시** 취소된다.
 * 닫기는 우상단 X다 — 뒤로가기를 두면 방금 끝난 취소 폼으로 돌아가게 된다.
 */
function CancelDoneScreen(props: {
  isPending: boolean;
  recarted: boolean;
  itemSum: number;
  refund: number;
  refundMethod: string;
  items: Array<{
    orderProductId: number | null;
    variantId: number;
    thumbnailUrl: string;
    brand: string;
    productName: string;
    optionName: string;
    quantity: number;
    price: { salePrice: number };
  }>;
  onClose: () => void;
  onPressOrderDetail: () => void;
  onPressOrderList: () => void;
}) {
  const {
    isPending,
    recarted,
    itemSum,
    refund,
    refundMethod,
    items,
    onClose,
    onPressOrderDetail,
    onPressOrderList,
  } = props;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-white">
      <View className="border-b-[0.5px] border-divider">
        <View className="h-46 flex-row items-center justify-between pl-16 pr-4">
          <Typography
            style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
            className="text-ink"
          >
            주문 취소
          </Typography>
          <TouchableOpacity onPress={onClose} activeOpacity={0.4} className="p-11">
            <CloseIcon size={22} color="#0F0F0F" thickness={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14" style={{ paddingTop: 24, paddingBottom: 20 }}>
          <Typography
            style={{ fontSize: 19, fontWeight: "700", lineHeight: 27.55, letterSpacing: -0.4 }}
            className="text-ink"
          >
            {isPending ? "주문 취소를 처리하고 있어요" : "주문이 취소되었어요"}
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 6 }} className="text-gray45">
            {isPending
              ? "결제사의 확인을 기다리고 있어요. 잠시 후 주문 상태가 바뀌어요."
              : "환불은 결제 수단으로 바로 진행돼요."}
          </Typography>
          {recarted && (
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
          <AmountRow label="취소 상품 금액" value={won(itemSum)} labelColor="#3C3C3C" fontSize={13.5} />
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
        {!!refundMethod && (
          <View className="px-14 pt-9">
            <AmountRow label="환불 수단" value={refundMethod} fontSize={12.5} valueColor="#3C3C3C" />
          </View>
        )}

        <Band marginTop={18} />
        <SectionTitle title="취소 상품" count={`${items.length}개`} style={{ paddingBottom: 4 }} />
        {items.map(item => (
          <View key={item.orderProductId ?? item.variantId} className="px-14 pt-12">
            <ProductBlock
              thumbnailUrl={item.thumbnailUrl}
              brand={item.brand}
              name={item.productName}
              meta={`${item.optionName} / ${item.quantity}개`}
              price={won(item.price.salePrice * item.quantity)}
            />
          </View>
        ))}

        <View className="flex-row px-14 pt-16" style={{ gap: 8 }}>
          <OutlineAction label="주문 상세" height={44} fontSize={13.5} onPress={onPressOrderDetail} />
          <OutlineAction label="주문 내역으로" height={44} fontSize={13.5} onPress={onPressOrderList} />
        </View>
        <BulletNotes
          style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 26 }}
          notes={["결제 수단별로 환불에 2~3영업일이 더 걸릴 수 있어요."]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
