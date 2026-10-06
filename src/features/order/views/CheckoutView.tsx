import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SheetList from "@/common/components/SheetList/SheetList";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useModal } from "@/common/providers/ModalProvider/context";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import {
  AmountRow,
  Band,
  BottomCta,
  ProductLine,
  RoundCheck,
  SectionTitle,
  SmallOutlineButton,
  TotalRow,
} from "@/features/order/components/OrderParts/OrderParts";
import PaymentMethodPicker from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";
import PortOnePaymentModal from "@/features/order/components/PortOnePaymentModal/PortOnePaymentModal";
import { CheckoutPaymentOutcome, useCheckoutPayment } from "@/features/order/hooks/useCheckoutPayment";
import { useGetCheckout } from "@/features/order/hooks/useOrderQueries";
import { CheckoutRequest } from "@/features/order/types/order";
import { isPaymentSelectionComplete, PaymentSelection } from "@/features/order/types/payment";
import {
  optionWithQuantity,
  resolveErrorCode,
  resolveErrorMessage,
  won,
} from "@/features/order/utils/orderFormat";

/**
 * C9 결제 — 배송지 → 요청사항 → 주문 상품 → 결제수단 → 금액, 하단에 동의 + 결제 CTA 고정.
 *
 * **배송지를 맨 위에** 둔다 — 가장 자주 바뀌는 값이고(선물·회사 배송), 잘못 보내면 되돌릴 수 없어
 * 결제 전에 반드시 한 번 읽히는 위치여야 한다. 금액은 CTA 직전에 놓아 "무엇을 얼마에" 순서가 맞는다.
 *
 * 배송지가 없으면(최초) 빈 자리를 숨기지 않고 점선 박스 + [배송지 추가]로 채우고, 요청사항은
 * 배송지가 정해지기 전이라 아예 감춘다. CTA는 금액 대신 막힌 이유를 말한다.
 *
 * 금액은 앱이 계산하지 않는다 — 전부 주문서 응답(`summary` · `ctaLabel`)이다. 배송지를 바꾸면
 * 주문서를 다시 받는다.
 *
 * 주문은 「결제하기」를 누른 순간에만 만든다 — 만들어지면 재고가 30분 잡힌다.
 */
const MEMO_SHEET_ID = "checkout-memo";
const MEMO_CUSTOM = "직접 입력";
const MEMO_MAX_LENGTH = 50;

export default function CheckoutView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CHECKOUT>>();
  const { show: showModal } = useModal();
  const { close: closeSheet } = useBottomSheetContext();

  const [addressId, setAddressId] = useState<number | undefined>(undefined);
  const request = useMemo<CheckoutRequest>(
    () => ({ cartItemIds: params.cartItemIds, direct: params.direct, deliveryAddressId: addressId }),
    [addressId, params.cartItemIds, params.direct]
  );
  const { data: checkout, isLoading, error, refetch } = useGetCheckout(request);

  const [memoPreset, setMemoPreset] = useState<string | null>(null);
  const [customMemo, setCustomMemo] = useState("");
  const [selection, setSelection] = useState<Partial<PaymentSelection>>({});
  const [isAgreed, setIsAgreed] = useState(false);

  const address = checkout?.deliveryAddress ?? null;
  const hasAddress = !!address;
  const memoOptions = useMemo(() => [...(checkout?.memoPresets ?? []), MEMO_CUSTOM], [checkout?.memoPresets]);

  /** 저장된 배송 메모가 요청사항의 초기값이다 — 프리셋이면 그것을, 아니면 [직접 입력]으로 되살린다 */
  useEffect(() => {
    const saved = address?.memo?.trim();

    if (!saved) {
      setMemoPreset(null);
      setCustomMemo("");
      return;
    }
    if (checkout?.memoPresets.includes(saved)) {
      setMemoPreset(saved);
      setCustomMemo("");
    } else {
      setMemoPreset(MEMO_CUSTOM);
      setCustomMemo(saved.slice(0, MEMO_MAX_LENGTH));
    }
    // 배송지가 바뀔 때만 다시 채운다 — 사용자가 고친 요청사항을 재조회가 덮지 않게
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address?.id]);

  /** 주문서를 열 수 없는 상태(마감·품절 섞임 · 재고 부족)는 돌아가서 고쳐야 한다 */
  useEffect(() => {
    if (!error) {
      return;
    }
    showModal({
      title: "주문서를 열 수 없어요",
      message: resolveErrorMessage(error, "잠시 후 다시 시도해 주세요."),
      buttons: [{ label: "확인", onPress: () => navigation.goBack() }],
    });
  }, [error, navigation, showModal]);

  const handleSelectMemo = useCallback(
    (value: string) => {
      setMemoPreset(value);
      closeSheet();
    },
    [closeSheet]
  );

  const { open: openMemoSheet } = useBottomSheet({
    id: MEMO_SHEET_ID,
    render: (
      <SheetList
        title="배송 요청사항"
        items={memoOptions.map(option => ({ value: option, label: option }))}
        mode="select"
        selectedValue={memoPreset ?? undefined}
        onSelect={handleSelectMemo}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const handlePressChangeAddress = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.ADDRESS_SELECT, {
      selectedAddressId: address?.id ?? undefined,
      onSelect: selected => {
        setAddressId(selected.id);
        return true;
      },
    });
  }, [address?.id, navigation]);

  const handlePressAddAddress = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.ADDRESS_FORM, {
      onSaved: newId => {
        if (newId) {
          setAddressId(newId);
        } else {
          void refetch();
        }
      },
    });
  }, [navigation, refetch]);

  const handleOutcome = useCallback(
    (outcome: CheckoutPaymentOutcome) => {
      switch (outcome.type) {
        case "PAID":
          toast.show("결제가 완료되었어요");
          navigation.replace(COMMON_ROUTES.ORDER_DETAIL, { orderId: outcome.orderId });
          return;
        case "PENDING":
          toast.show("결제를 확인하고 있어요. 잠시 후 주문 상태가 바뀌어요");
          navigation.replace(COMMON_ROUTES.ORDER_DETAIL, { orderId: outcome.orderId });
          return;
        case "NOT_PAID":
          toast.show(outcome.message);
          return;
        case "CLOSED":
          showModal({
            title: "주문이 완료되지 않았어요",
            message: outcome.message,
            buttons: [{ label: "확인" }],
          });
          void refetch();
      }
    },
    [navigation, refetch, showModal]
  );

  const payment = useCheckoutPayment({ onOutcome: handleOutcome });

  const memoValue = memoPreset === MEMO_CUSTOM ? customMemo.trim() : (memoPreset ?? "");
  const methodReady = isPaymentSelectionComplete(selection);
  const isReady = hasAddress && methodReady && isAgreed;

  const ctaLabel = (() => {
    if (!hasAddress) {
      return "배송지를 추가해 주세요";
    }
    if (!selection.method) {
      return "결제수단을 선택해 주세요";
    }
    if (!methodReady) {
      return selection.method === "CARD" ? "카드사를 선택해 주세요" : "간편결제를 선택해 주세요";
    }
    if (!isAgreed) {
      return "결제에 동의해 주세요";
    }
    return checkout?.ctaLabel ?? "결제하기";
  })();

  const handlePressPay = useCallback(async () => {
    if (!checkout || !address || !isReady || payment.isBusy) {
      return;
    }
    // 같은 주문이 살아 있어도 만료가 가까우면 새로 시작한다(승인 도중 만료되면 자동 환불된다)
    if (payment.hasPendingOrder() && payment.isPendingExpiring()) {
      payment.resetPending();
      showModal({
        title: "주문 시간이 만료됐어요",
        message: "다시 주문해 주세요.",
        buttons: [{ label: "확인" }],
      });
      void refetch();
      return;
    }

    payment.setIsBusy(true);
    try {
      const response = await payment.prepare(
        {
          cartItemIds: params.cartItemIds,
          direct: params.direct,
          deliveryAddressId: address.id ?? undefined,
          deliveryMemo: memoValue || undefined,
          payment: selection as PaymentSelection,
          expectedTotalAmount: checkout.summary.totalAmount,
        },
        selection as PaymentSelection
      );

      payment.setIsBusy(false);
      // 결제사 화면으로 넘어간다는 사실을 먼저 알린다(시안 C9) — 인증을 마치면 이 화면으로 돌아온다
      showModal({
        iconBackgroundColor: "#F4F4F5",
        icon: (
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 6v6l4 2"
              stroke="#8E8E8E"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx={12} cy={12} r={8.5} stroke="#8E8E8E" strokeWidth={1.8} />
          </Svg>
        ),
        title: "결제사 인증 창으로 이동해요",
        message: "인증을 마치면 이 화면으로 돌아와\n주문이 완료됩니다.",
        buttons: [{ label: "확인", onPress: () => payment.openPaymentWindow(response.payment) }],
      });
    } catch (prepareError) {
      payment.setIsBusy(false);
      const code = resolveErrorCode(prepareError);
      const message = resolveErrorMessage(
        prepareError,
        "주문을 만들지 못했어요. 잠시 후 다시 시도해 주세요."
      );

      switch (code) {
        case "ORDER_AMOUNT_CHANGED":
        case "PAYMENT_METHOD_UNAVAILABLE":
          toast.show(message);
          void refetch();
          return;
        case "CART_ITEM_NOT_PURCHASABLE":
        case "INSUFFICIENT_STOCK":
          showModal({
            title: "주문할 수 없는 상품이 있어요",
            message,
            buttons: [{ label: "확인", onPress: () => navigation.goBack() }],
          });
          return;
        case "ORDER_ALREADY_CLOSED":
          payment.resetPending();
          toast.show(message);
          void refetch();
          return;
        case "PAYMENT_ALREADY_IN_PROGRESS": {
          // 재시도했는데 이미 결제 완료(창 밖에서 끝났다) — 주문 상세로
          const orderId = payment.getPendingOrderId();

          payment.resetPending();
          if (orderId) {
            handleOutcome({ type: "PAID", orderId });
          }
          return;
        }
        default:
          toast.show(message);
      }
    }
  }, [
    address,
    checkout,
    handleOutcome,
    isReady,
    memoValue,
    navigation,
    params.cartItemIds,
    params.direct,
    payment,
    refetch,
    selection,
    showModal,
  ]);

  if (isLoading || !checkout) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="주문/결제" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">{isLoading && <Spinner />}</View>
      </View>
    );
  }

  const items = checkout.groups.flatMap(group =>
    group.items.map(item => ({ ...item, brand: group.marketName }))
  );
  const { summary } = checkout;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="주문/결제" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SectionTitle
          title="배송지"
          right={
            hasAddress ? <SmallOutlineButton label="변경" onPress={handlePressChangeAddress} /> : undefined
          }
        />

        {address ? (
          <View className="px-14 pt-12">
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Typography
                style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 20.3 }}
                className="text-ink"
              >
                {address.recipientName}
              </Typography>
              {!!address.isDefault && (
                <View className="rounded-base bg-roseTint px-8 py-4">
                  <Typography variant="badge" className="text-roseText">
                    기본 배송지
                  </Typography>
                </View>
              )}
            </View>
            <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 6 }} className="text-ink76">
              {`${address.phoneNumber}\n(${address.zipCode}) ${address.address}${
                address.detailAddress ? `, ${address.detailAddress}` : ""
              }`}
            </Typography>
          </View>
        ) : (
          <View className="px-14 pt-12">
            <View
              className="items-center rounded-base"
              style={{
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#DCDCDE",
                paddingVertical: 26,
                paddingHorizontal: 16,
              }}
            >
              <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z"
                  stroke="#C7C7C7"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx={12} cy={10} r={2.6} stroke="#C7C7C7" strokeWidth={1.4} />
              </Svg>
              <Typography
                style={{ fontSize: 14, fontWeight: "600", lineHeight: 21, marginTop: 13 }}
                className="text-ink"
              >
                등록된 배송지가 없어요
              </Typography>
              <Typography
                style={{ fontSize: 12.5, lineHeight: 20, marginTop: 5 }}
                className="text-center text-gray45"
              >
                배송지를 추가하면 주문을 이어갈 수 있어요
              </Typography>
              <TouchableOpacity
                onPress={handlePressAddAddress}
                activeOpacity={0.75}
                className="h-44 flex-row items-center rounded-base bg-rose px-20"
                style={{ marginTop: 16, gap: 6 }}
              >
                <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 6v12" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
                  <Path d="M6 12h12" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
                </Svg>
                <Typography
                  style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 13.5 }}
                  className="text-white"
                >
                  배송지 추가
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {hasAddress && (
          <View className="px-14 pt-18">
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
              배송 요청사항
            </Typography>
            <TouchableOpacity
              onPress={openMemoSheet}
              activeOpacity={0.6}
              className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
              style={{ marginTop: 9 }}
            >
              <Typography
                style={{ fontSize: 14.5, lineHeight: 14.5 }}
                className={memoPreset ? "text-ink" : "text-gray71"}
              >
                {memoPreset ?? "요청사항을 선택해 주세요"}
              </Typography>
              <ChevronDownIcon size={14} color="#C7C7C7" />
            </TouchableOpacity>

            {memoPreset === MEMO_CUSTOM && (
              <View
                className="h-48 flex-row items-center rounded-base border-[1px] border-borderButton px-13"
                style={{ marginTop: 8, gap: 10 }}
              >
                <TextInput
                  value={customMemo}
                  onChangeText={setCustomMemo}
                  placeholder="예) 부재 시 문 앞에 놓아주세요"
                  placeholderTextColor="#B5B5B5"
                  maxLength={MEMO_MAX_LENGTH}
                  className="m-0 min-w-0 flex-1 p-0 text-ink"
                  style={{ fontSize: 14.5, fontFamily: "Pretendard-Regular" }}
                />
                <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
                  {customMemo.length}/{MEMO_MAX_LENGTH}
                </Typography>
              </View>
            )}
          </View>
        )}

        <Band marginTop={20} />

        <SectionTitle title="주문 상품" count={summary.itemCount} />
        {items.map(item => (
          <View key={`${item.cartId ?? item.variantId}`} className="px-14 pt-14">
            <ProductLine
              thumbnailUrl={item.thumbnailUrl}
              brand={item.brand}
              name={item.productName}
              option={optionWithQuantity(item.optionName, item.quantity)}
              price={won(item.price.salePrice * item.quantity)}
            />
          </View>
        ))}

        {/*
          발송 시기 고지 — 결제 버튼보다 위에 있어야 한다(결정 3·15). 발송기한은 공구 마감 + N영업일인데
          주문서 응답이 날짜를 주지 않아 날짜 없이 정책만 적는다. 실제 예정일은 주문 내역에 뜬다.
        */}
        <View
          className="mx-14 flex-row items-center rounded-base bg-band px-12 py-10"
          style={{ marginTop: 12, gap: 8 }}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M3.5 7.5h11v9h-11z" stroke="#3C3C3C" strokeWidth={1.6} />
            <Path d="M14.5 10.5h3.5l2.5 3v3h-6" stroke="#3C3C3C" strokeWidth={1.6} />
            <Circle cx={7} cy={17.5} r={1.6} stroke="#3C3C3C" strokeWidth={1.6} />
            <Circle cx={17} cy={17.5} r={1.6} stroke="#3C3C3C" strokeWidth={1.6} />
          </Svg>
          <Typography style={{ fontSize: 12.5, lineHeight: 18.75 }} className="min-w-0 flex-1 text-ink76">
            공구 마감 후 순차 발송 (주말·공휴일 제외)
          </Typography>
        </View>

        <Band marginTop={20} />

        <View className="flex-row items-baseline px-14" style={{ paddingTop: 18, gap: 8 }}>
          <Typography
            style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
            className="text-ink"
          >
            결제수단
          </Typography>
          <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
            카드 · 간편결제
          </Typography>
        </View>
        <PaymentMethodPicker
          sheetId="checkout-card-issuer"
          methods={checkout.paymentMethods}
          value={selection}
          onChange={setSelection}
        />

        <Band marginTop={14} />

        <SectionTitle title="결제 금액" />
        <View className="px-14" style={{ paddingTop: 13, gap: 7 }}>
          <AmountRow label="총 상품 가격" value={won(summary.productTotal)} />
          {summary.discountTotal > 0 && (
            <AmountRow
              label="공동구매 할인"
              value={`−${won(summary.discountTotal)}`}
              valueColor="#CF3D61"
              valueWeight="600"
            />
          )}
          <AmountRow
            label="배송비"
            value={summary.deliveryFeeTotal > 0 ? won(summary.deliveryFeeTotal) : "무료배송"}
          />
        </View>
        <TotalRow label="총 결제 금액" value={won(summary.totalAmount)} />

        <Typography style={{ fontSize: 11.5, lineHeight: 19.55 }} className="px-14 pb-26 pt-20 text-gray45">
          쇼룸즈는 통신판매중개자로서 거래 당사자가 아니며, 상품·배송·환불 책임은 판매자에게 있습니다.
        </Typography>
      </ScrollView>

      <BottomCta
        label={ctaLabel}
        enabled={isReady}
        loading={payment.isBusy}
        onPress={handlePressPay}
        top={
          <TouchableOpacity
            onPress={() => hasAddress && setIsAgreed(prev => !prev)}
            activeOpacity={0.6}
            disabled={!hasAddress}
            className="flex-row items-start"
            style={{ gap: 10, paddingTop: 2, paddingBottom: 12 }}
          >
            <View style={{ marginTop: 1 }}>
              <RoundCheck isChecked={isAgreed} disabled={!hasAddress} />
            </View>
            <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="min-w-0 flex-1 text-ink76">
              <Typography
                style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }}
                className="text-roseText"
              >
                [필수]
              </Typography>{" "}
              주문 내용을 확인했으며 결제에 동의합니다
            </Typography>
          </TouchableOpacity>
        }
      />

      <PortOnePaymentModal
        payment={payment.paymentWindow}
        onComplete={(paymentId, result) => void payment.confirm(paymentId, result, false)}
        onClose={paymentId => void payment.confirm(paymentId, undefined, true)}
        onError={() => {
          payment.openPaymentWindow(null);
          toast.show("결제창을 열지 못했어요. 다시 시도해 주세요.");
        }}
      />
    </View>
  );
}
