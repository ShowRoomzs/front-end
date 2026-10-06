import { RouteProp, useRoute } from "@react-navigation/native";
import { randomUUID } from "expo-crypto";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import ImageUploader from "@/common/components/ImageUploader/ImageUploader";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useImagePicker } from "@/common/hooks/useImagePicker";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { useModal } from "@/common/providers/ModalProvider/context";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { formatPhoneNumber } from "@/features/auth/utils/formatPhoneNumber";
import { Address } from "@/features/mypage/types/address";
import CarrierSheet from "@/features/order/components/CarrierSheet/CarrierSheet";
import ClaimReceipt from "@/features/order/components/ClaimReceipt/ClaimReceipt";
import ExchangeOptionSheet from "@/features/order/components/ExchangeOptionSheet/ExchangeOptionSheet";
import {
  AmountRow,
  Band,
  BottomCta,
  BulletNotes,
  CautionBox,
  FieldTitle,
  ProductLine,
  RoundCheck,
  SectionTitle,
  SelectField,
  SmallOutlineButton,
  SquareCheck,
  TotalRow,
} from "@/features/order/components/OrderParts/OrderParts";
import PaymentMethodPicker, {
  RadioDot,
} from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";
import PortOnePaymentModal from "@/features/order/components/PortOnePaymentModal/PortOnePaymentModal";
import { ClaimPaymentOutcome, useClaimPayment } from "@/features/order/hooks/useClaimPayment";
import { invalidateOrderQueries, useGetClaimForm } from "@/features/order/hooks/useOrderQueries";
import { claimService } from "@/features/order/services/claimService";
import { ClaimReasonCode, CreateClaimRequest, DeliveryCarrierCode } from "@/features/order/types/claim";
import {
  isPaymentSelectionComplete,
  PaymentMethods,
  PaymentSelection,
  paymentSelectionLabel,
} from "@/features/order/types/payment";
import { copyToClipboard } from "@/features/order/utils/copyToClipboard";
import { resolveErrorCode, resolveErrorMessage, won } from "@/features/order/utils/orderFormat";

/**
 * C10-3 반품 · 교환 요청 — 주문 상세의 [반품 요청] / [교환 요청]에서 진입한다.
 *
 * 배송 API가 **추적 전용**이라 수거 예약을 할 수 없다 — 방법은 **직접 발송** 하나다. 고객이 택배사에
 * 접수하고 송장을 넣으면 추적으로 회수 상황을 갱신한다. 아직 부치지 않았으면 [나중에 입력하기]로
 * 요청만 먼저 접수하고, 기한(7일) 안에 넣지 않으면 자동 취소된다. 「수거 요청」을 선택지로 두면
 * 기사님을 기다리는데 아무도 오지 않는 사고가 난다 — 그래서 하나뿐이어도 **선택된 상태로** 보여준다.
 *
 * 사유를 고르는 순간 아래가 함께 바뀐다 — 상세 내용(브랜드 귀책 · 필수) · 사진(선택) · 택배비 안내
 * (고객 귀책 = 선불 / 브랜드 귀책 = 착불) · 금액(차감 · 재발송비). 사유·택배사·금액은 서버가 내린다.
 *
 * 교환은 고객 귀책이면 재발송 배송비를 **요청할 때 결제**한다 — 결제가 확정돼야 접수된다.
 * 결제창이 실패·취소로 끝나면 이 화면으로 돌아와 토스트를 띄우고 입력 내용은 그대로 둔다.
 *
 * 빠진 항목은 CTA 라벨이 순서대로 알려준다(「반품 사유를 선택해 주세요」).
 */
const CARRIER_SHEET_ID = "claim-request-carrier";
const OPTION_SHEET_ID = "claim-request-option";
const PAYMENT_SHEET_ID = "claim-request-card-issuer";

/** 브랜드 귀책 사유 — 불량·오배송 */
function isSellerFault(feeBearer?: string) {
  return feeBearer === "SELLER";
}

export default function ClaimRequestView() {
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CLAIM_REQUEST>>();
  const { orderProductId, type } = params;
  const isReturn = type === "RETURN";
  const kw = isReturn ? "반품" : "교환";

  const { show: showModal } = useModal();
  const { close: closeSheet } = useBottomSheetContext();
  const { data: form, isLoading, error, refetch } = useGetClaimForm(orderProductId, type);
  const { mutateAsync: uploadImages } = useUploadImagesMutation();

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [exchangeOptions, setExchangeOptions] = useState<Record<number, number>>({});
  const [optionTarget, setOptionTarget] = useState<number | null>(null);
  const [reasonCode, setReasonCode] = useState<ClaimReasonCode | null>(null);
  const [detail, setDetail] = useState("");
  const [carrier, setCarrier] = useState<DeliveryCarrierCode | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isLater, setIsLater] = useState(false);
  const [reshipAddress, setReshipAddress] = useState<Address | null>(null);
  const [payment, setPayment] = useState<Partial<PaymentSelection>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptClaimId, setReceiptClaimId] = useState<number | null>(null);
  const { imageUrls, handleAddImage, handleRemoveImage } = useImagePicker({
    maxCount: form?.photoMax ?? 10,
    allowsMultipleSelection: true,
  });

  /** 진입 항목은 체크된 채로 시작한다 */
  useEffect(() => {
    if (!form) {
      return;
    }
    setSelected(new Set(form.items.filter(item => item.preselected).map(item => item.orderProductId)));
  }, [form]);

  /** 신청 가능한 항목이 아니면 409 — 돌아가서 주문 상세를 다시 본다 */
  useEffect(() => {
    if (!error) {
      return;
    }
    showModal({
      title: `${kw}을 요청할 수 없어요`,
      message: resolveErrorMessage(error, "잠시 후 다시 시도해 주세요."),
      buttons: [{ label: "확인", onPress: () => navigation.goBack() }],
    });
  }, [error, kw, navigation, showModal]);

  const reason = form?.reasons.find(item => item.code === reasonCode);
  const sellerFault = isSellerFault(reason?.feeBearer);
  const consumerFault = !!reason && !sellerFault;
  const needDetail = !!reason?.detailRequired;
  const fee = consumerFault ? (form?.fees.consumerFault ?? 0) : 0;
  const selectedItems = useMemo(
    () => (form?.items ?? []).filter(item => selected.has(item.orderProductId)),
    [form?.items, selected]
  );
  const sum = selectedItems.reduce((total, item) => total + item.unitPrice * item.claimableQuantity, 0);
  /**
   * 결제가 필요한 교환 — 고객 귀책이고 재발송비가 0보다 크다.
   * 폼 API가 열린 결제수단 목록을 주지 않아 주문서와 같은 기본 목록을 쓴다 — 꺼진 수단을 고르면
   * 서버가 `PAYMENT_METHOD_UNAVAILABLE`로 막고 그 문구를 띄운다.
   */
  const needPay = !isReturn && consumerFault && fee > 0;
  const paymentMethods: PaymentMethods = useMemo(
    () => ({
      cardIssuers: ["SHINHAN", "SAMSUNG", "HYUNDAI", "KB", "LOTTE", "HANA", "BC", "NH", "WOORI"],
      easyPayProviders: ["KAKAOPAY", "NAVERPAY", "TOSSPAY"],
    }),
    []
  );

  // ─── 시트

  const handlePickCarrier = useCallback(
    (code: DeliveryCarrierCode) => {
      setCarrier(code);
      closeSheet();
    },
    [closeSheet]
  );

  const { open: openCarrierSheet } = useBottomSheet({
    id: CARRIER_SHEET_ID,
    render: <CarrierSheet carriers={form?.carriers ?? []} selected={carrier} onPick={handlePickCarrier} />,
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const optionItem = form?.items.find(item => item.orderProductId === optionTarget);
  const { open: openOptionSheet } = useBottomSheet({
    id: OPTION_SHEET_ID,
    render: (
      <ExchangeOptionSheet
        productName={optionItem?.productName ?? ""}
        options={optionItem?.exchangeOptions ?? []}
        selected={optionTarget ? (exchangeOptions[optionTarget] ?? null) : null}
        onCancel={closeSheet}
        onApply={variantId => {
          if (optionTarget) {
            setExchangeOptions(prev => ({ ...prev, [optionTarget]: variantId }));
          }
          closeSheet();
        }}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const handleOpenOption = useCallback(
    (targetId: number) => {
      setOptionTarget(targetId);
      requestAnimationFrame(() => openOptionSheet());
    },
    [openOptionSheet]
  );

  const handleChangeReshipAddress = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.ADDRESS_SELECT, {
      selectedAddressId: reshipAddress?.id,
      matchAddress:
        !reshipAddress && form?.reshipTo
          ? {
              recipientName: form.reshipTo.recipientName,
              zipCode: form.reshipTo.zipCode,
              address: form.reshipTo.address,
            }
          : undefined,
      onSelect: address => {
        setReshipAddress(address);
        return true;
      },
    });
  }, [form?.reshipTo, navigation, reshipAddress]);

  // ─── 검증

  const missing = (() => {
    if (!form) {
      return "";
    }
    if (selectedItems.length === 0) {
      return `${kw}할 상품을 선택해 주세요`;
    }
    if (!isReturn && selectedItems.some(item => !exchangeOptions[item.orderProductId])) {
      return "교환할 옵션을 선택해 주세요";
    }
    if (!reason) {
      return `${kw} 사유를 선택해 주세요`;
    }
    if (needDetail && !detail.trim()) {
      return "상세 내용을 입력해 주세요";
    }
    if (!isLater && !carrier) {
      return "택배사를 선택해 주세요";
    }
    if (!isLater && !invoiceNumber.trim()) {
      return "송장 번호를 입력해 주세요";
    }
    if (
      !isReturn &&
      consumerFault &&
      selectedItems.some(
        item =>
          item.exchangeOptions?.find(option => option.variantId === exchangeOptions[item.orderProductId])
            ?.current
      )
    ) {
      return "같은 옵션은 불량 · 오배송일 때만 교환돼요";
    }
    if (needPay && !isPaymentSelectionComplete(payment)) {
      return "결제 수단을 선택해 주세요";
    }
    return null;
  })();

  const ready = !!form && missing === null;
  const ctaLabel = (() => {
    const count = selectedItems.length;

    if (!ready) {
      return missing ?? "";
    }
    if (isReturn) {
      return `반품 요청하기 (${count}개 · ${fee > 0 ? `${won(fee)} 차감` : "배송비 무료"})`;
    }
    if (needPay) {
      return `${won(fee)} 결제하고 교환 요청하기 (${count}개)`;
    }
    return `교환 요청하기 (${count}개 · 배송비 무료)`;
  })();

  // ─── 요청 · 결제

  /**
   * 멱등키 — 결제만 실패해 **수단만 바꿔** 다시 보낼 때는 같은 키(서버가 같은 요청에 결제 시도만 새로 만든다),
   * 내용을 고쳤으면 새 키(이전 미결제 요청은 서버가 지운다). 서버 결제 연동 규칙 11.
   */
  const idempotency = useRef<{ key: string; signature: string } | null>(null);
  const contentSignature = JSON.stringify({
    items: selectedItems.map(item => [item.orderProductId, exchangeOptions[item.orderProductId] ?? null]),
    reasonCode,
    detail: detail.trim(),
    invoice: isLater ? null : [carrier, invoiceNumber.trim()],
    reship: reshipAddress?.id ?? null,
    images: imageUrls,
  });

  const handleClaimPaymentOutcome = useCallback(
    (outcome: ClaimPaymentOutcome) => {
      if (outcome.type === "PAID") {
        const claimId = outcome.result.claimIds[0];

        invalidateOrderQueries();
        idempotency.current = null;
        if (claimId) {
          setReceiptClaimId(claimId);
        }
        return;
      }
      if (outcome.type === "CANCELLED") {
        idempotency.current = null;
        showModal({
          title: "결제가 취소되었어요",
          message: outcome.requestExpired
            ? "요청 시간이 지나 결제가 자동으로 취소되었어요. 결제 금액은 자동으로 환불돼요. 다시 요청해 주세요."
            : "결제가 자동으로 취소되었어요. 결제 금액은 자동으로 환불돼요.",
          buttons: [{ label: "확인" }],
        });
        void refetch();
        return;
      }
      toast.show("결제가 완료되지 않았어요. 입력한 내용은 그대로예요.");
    },
    [refetch, showModal]
  );

  const claimPayment = useClaimPayment({ onOutcome: handleClaimPaymentOutcome });

  const submit = useCallback(async () => {
    if (!form || !reason || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (!idempotency.current || idempotency.current.signature !== contentSignature) {
        idempotency.current = { key: randomUUID(), signature: contentSignature };
      }

      const localUris = reason.photoAllowed ? imageUrls.filter(url => !url.startsWith("http")) : [];
      const uploaded = localUris.length > 0 ? await uploadImages({ localUris, type: "INQUIRY" }) : [];

      const body: CreateClaimRequest = {
        idempotencyKey: idempotency.current.key,
        type,
        deliveryGroupId: form.deliveryGroupId,
        items: selectedItems.map(item => ({
          orderProductId: item.orderProductId,
          exchangeVariantId: isReturn ? undefined : exchangeOptions[item.orderProductId],
        })),
        reasonCode: reason.code,
        reasonDetail: needDetail ? detail.trim() : undefined,
        imageUrls: reason.photoAllowed ? uploaded : undefined,
        invoice: isLater || !carrier ? null : { carrier, trackingNumber: invoiceNumber.replace(/\D/g, "") },
        expectedFee: fee,
        reshipAddressId: isReturn ? undefined : reshipAddress?.id,
        payment: needPay ? (payment as PaymentSelection) : undefined,
      };
      const response = await claimService.create(body);

      if (response.payment) {
        // 결제가 확정돼야 접수된다 — 결제창으로
        claimPayment.openPaymentWindow(response.payment);
        return;
      }
      idempotency.current = null;
      invalidateOrderQueries();
      setReceiptClaimId(response.claimIds[0]);
    } catch (submitError) {
      const code = resolveErrorCode(submitError);

      if (code === "CLAIM_AMOUNT_CHANGED") {
        void refetch();
      }
      // 응답을 받았으면(검증 실패 등) 다음 시도는 새 키로 — 받지 못했으면 같은 키로 재전송한다
      if (code) {
        idempotency.current = null;
      }
      toast.show(resolveErrorMessage(submitError, `${kw}을 요청하지 못했어요. 잠시 후 다시 시도해 주세요.`));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    carrier,
    claimPayment,
    contentSignature,
    detail,
    exchangeOptions,
    fee,
    form,
    imageUrls,
    invoiceNumber,
    isLater,
    isReturn,
    isSubmitting,
    kw,
    needDetail,
    needPay,
    payment,
    reason,
    refetch,
    reshipAddress?.id,
    selectedItems,
    type,
    uploadImages,
  ]);

  const handlePressCta = useCallback(() => {
    if (!ready) {
      return;
    }
    const laterNote = isLater
      ? ` ${form?.invoiceDueDays ?? 7}일 안에 송장을 등록하지 않으면 요청이 취소돼요.`
      : "";
    const message = isReturn
      ? `환불 예정 금액 ${won(Math.max(0, sum - fee))}`
      : (needPay
          ? `재발송 배송비 ${won(fee)}이 결제돼요. 반송 택배비는 보내실 때 택배사에 직접 결제해 주세요.`
          : "브랜드 귀책이라 착불로 보내주세요. 배송비는 들지 않아요.") + laterNote;

    showModal({
      title: `${kw}을 요청할까요?`,
      message,
      buttons: [
        { label: "닫기", variant: "outline" },
        { label: `${kw} 요청하기`, onPress: () => void submit() },
      ],
    });
  }, [fee, form?.invoiceDueDays, isLater, isReturn, kw, needPay, ready, showModal, submit, sum]);

  if (isLoading || !form) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title={`${kw} 요청`} onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">{isLoading && <Spinner />}</View>
      </View>
    );
  }

  const allSelected = form.items.length > 0 && selected.size === form.items.length;
  const courierLine = (() => {
    if (!reason) {
      return "사유를 고르면 선불 · 착불 여부를 알려드려요";
    }
    return sellerFault
      ? "착불로 보내주세요 · 택배비는 브랜드가 부담해요"
      : "선불로 보내주세요 · 반송 택배비는 택배사에 직접 결제해요";
  })();
  const returnAddress = `${form.returnTo.address}${form.returnTo.detailAddress ? ` ${form.returnTo.detailAddress}` : ""}`;
  /** 고른 배송지가 있으면 그것, 없으면 원 주문 배송지(폼 기본값) */
  const reshipLines = (() => {
    const joinAddress = (zip: string, address: string, detailAddress?: string | null) =>
      `(${zip}) ${address}${detailAddress ? `, ${detailAddress}` : ""}`;

    if (reshipAddress) {
      return {
        head: `${reshipAddress.recipientName} · ${formatPhoneNumber(reshipAddress.phoneNumber.replace(/\D/g, ""))}`,
        body: joinAddress(reshipAddress.zipCode, reshipAddress.address, reshipAddress.detailAddress),
      };
    }
    if (form.reshipTo) {
      return {
        head: `${form.reshipTo.recipientName} · ${form.reshipTo.phone}`,
        body: joinAddress(form.reshipTo.zipCode, form.reshipTo.address, form.reshipTo.detailAddress),
      };
    }
    return null;
  })();
  const deductionText = (() => {
    if (!reason) {
      return "사유 선택 후 계산";
    }
    return fee > 0 ? `-${won(fee)}` : "0원";
  })();

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScreenHeader title={`${kw} 요청`} onPressBack={navigation.goBack} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* 상품 선택 */}
          <TouchableOpacity
            onPress={() =>
              setSelected(allSelected ? new Set() : new Set(form.items.map(item => item.orderProductId)))
            }
            activeOpacity={0.6}
            className="flex-row items-center px-14"
            style={{ paddingTop: 16, paddingBottom: 6, gap: 10 }}
          >
            <RoundCheck isChecked={allSelected} />
            <Typography
              style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }}
              className="min-w-0 flex-1 text-ink"
            >
              전체 선택
            </Typography>
            <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
              {selected.size}/{form.items.length}개
            </Typography>
          </TouchableOpacity>

          {form.items.map(item => {
            const isChecked = selected.has(item.orderProductId);
            const pickedOption = item.exchangeOptions?.find(
              option => option.variantId === exchangeOptions[item.orderProductId]
            );

            return (
              <View key={item.orderProductId} className="px-14 py-10">
                <TouchableOpacity
                  onPress={() =>
                    setSelected(prev => {
                      const next = new Set(prev);

                      if (next.has(item.orderProductId)) {
                        next.delete(item.orderProductId);
                      } else {
                        next.add(item.orderProductId);
                      }
                      return next;
                    })
                  }
                  activeOpacity={0.6}
                  className="flex-row items-start"
                  style={{ gap: 10 }}
                >
                  <View style={{ marginTop: 2 }}>
                    <RoundCheck isChecked={isChecked} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <ProductLine
                      thumbnailUrl={item.thumbnailUrl}
                      brand={form.brandName}
                      name={item.productName}
                      option={`${item.optionName} · ${item.claimableQuantity}개`}
                      price={won(item.unitPrice * item.claimableQuantity)}
                    />
                  </View>
                </TouchableOpacity>
                {!isReturn && isChecked && (
                  <View style={{ marginTop: 10, marginLeft: 31 }}>
                    <SelectField
                      height={44}
                      fontSize={14}
                      value={pickedOption?.optionName}
                      placeholder="교환할 옵션을 선택해 주세요"
                      onPress={() => handleOpenOption(item.orderProductId)}
                    />
                  </View>
                )}
              </View>
            );
          })}

          <Band marginTop={10} />

          {/* 사유 */}
          <SectionTitle title={`${kw} 사유`} style={{ paddingTop: 20 }} />
          <Typography style={{ fontSize: 12, lineHeight: 19.2 }} className="px-14 pt-8 text-gray45">
            {isReturn
              ? "단순 변심 · 주문 실수는 배송비가 차감돼요."
              : "단순 변심 · 주문 실수는 재발송 배송비가 발생해요."}
          </Typography>
          <View className="px-14 pt-6">
            {form.reasons.map(item => {
              const isPicked = item.code === reasonCode;

              return (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => {
                    setReasonCode(item.code);
                    setDetail("");
                  }}
                  activeOpacity={0.6}
                  className="flex-row items-center"
                  style={{ minHeight: 44, gap: 10 }}
                >
                  <RadioDot isSelected={isPicked} />
                  <Typography
                    style={{ fontSize: 14, fontWeight: isPicked ? "600" : "400", lineHeight: 19.6 }}
                    className={`min-w-0 flex-1 ${isPicked ? "text-ink" : "text-ink76"}`}
                  >
                    {item.hint ? `${item.label} (${item.hint})` : item.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          {needDetail && (
            <View className="px-14 pt-12">
              <FieldTitle
                label="상세 내용 "
                suffix={<Typography className="text-roseText">(필수)</Typography>}
                right={
                  <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
                    {detail.length}/{form.detailMaxLength}
                  </Typography>
                }
              />
              <View
                className="rounded-base border-[1px] border-borderButton px-13 py-12"
                style={{ marginTop: 9, minHeight: 104 }}
              >
                <TextInput
                  value={detail}
                  onChangeText={setDetail}
                  placeholder="어떤 문제가 있었는지 자세히 적어 주세요."
                  placeholderTextColor="#B5B5B5"
                  multiline
                  maxLength={form.detailMaxLength}
                  className="m-0 flex-1 p-0 text-ink"
                  style={{
                    fontSize: 13.5,
                    lineHeight: 22.3,
                    fontFamily: "Pretendard-Regular",
                    textAlignVertical: "top",
                  }}
                />
              </View>
              {reason?.photoAllowed && (
                <>
                  <View style={{ marginTop: 18 }}>
                    <FieldTitle
                      label="사진 첨부 "
                      suffix={
                        <Typography style={{ fontWeight: "400" }} className="text-gray45">
                          (선택)
                        </Typography>
                      }
                    />
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <ImageUploader
                      imageUrls={imageUrls}
                      maxCount={form.photoMax}
                      onAddImage={handleAddImage}
                      onRemoveImage={handleRemoveImage}
                    />
                  </View>
                  <Typography
                    style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 8 }}
                    className="text-gray45"
                  >
                    파손 부위나 받은 상품이 보이게 찍어 주세요. 검수 근거가 돼요.
                  </Typography>
                </>
              )}
            </View>
          )}

          <Band marginTop={20} />

          {/* 방법 — 직접 발송 하나 */}
          <SectionTitle title={`${kw} 방법`} style={{ paddingTop: 20 }} />
          <CautionBox
            style={{ marginTop: 12 }}
            lines={[
              "선택한 상품만 한 박스에 포장해 주세요. 다른 반품·교환 상품은 함께 넣지 마세요.",
              isReturn
                ? "브랜드가 상품을 받아 검수를 마치면 환불되고, 알림으로 알려드려요."
                : "브랜드가 상품을 받아 검수를 마치면 새 상품을 보내드려요.",
            ]}
          />
          <View className="px-14 pt-14">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <RadioDot isSelected />
              <Typography
                style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 14.5 }}
                className="text-ink"
              >
                직접 발송
              </Typography>
            </View>
            <Typography
              style={{ fontSize: 12.5, lineHeight: 20.6, marginTop: 7, paddingLeft: 28 }}
              className="text-gray45"
            >
              가까운 택배사에 직접 접수해 아래 주소로 보내주세요. 송장 번호를 입력하면 배송 상황을 자동으로
              알려드려요.
            </Typography>
            <View style={{ marginTop: 12, paddingLeft: 28, gap: 8 }}>
              <SelectField
                locked={isLater}
                value={form.carriers.find(item => item.code === carrier)?.label}
                placeholder="택배사를 선택해 주세요"
                onPress={openCarrierSheet}
              />
              <View
                className="h-48 flex-row items-center rounded-base border-[1px] border-borderButton px-13"
                style={{ backgroundColor: isLater ? "#F7F7F8" : "#FFFFFF" }}
              >
                <TextInput
                  value={invoiceNumber}
                  onChangeText={text => setInvoiceNumber(text.replace(/[^\d\s-]/g, ""))}
                  editable={!isLater}
                  placeholder="송장 번호를 입력해 주세요"
                  placeholderTextColor={isLater ? "#C7C7C7" : "#B5B5B5"}
                  keyboardType="number-pad"
                  maxLength={30}
                  className="m-0 flex-1 p-0 text-ink"
                  style={{
                    fontSize: 14.5,
                    fontFamily: "Pretendard-Regular",
                    color: isLater ? "#C7C7C7" : "#0F0F0F",
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setIsLater(prev => !prev)}
                activeOpacity={0.6}
                className="flex-row items-center"
                style={{ minHeight: 40, gap: 9 }}
              >
                <SquareCheck isChecked={isLater} />
                <Typography style={{ fontSize: 13, lineHeight: 18.2 }} className="min-w-0 flex-1 text-ink76">
                  나중에 입력하기{" "}
                  <Typography style={{ fontSize: 13, lineHeight: 18.2 }} className="text-gray45">
                    ({form.invoiceDueDays}일 안에 입력하지 않으면 요청이 취소돼요)
                  </Typography>
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          <Band marginTop={18} />

          {/* 신청 정보 */}
          <SectionTitle title={`${kw} 신청 정보`} style={{ paddingTop: 20 }} />
          <View className="px-14 pt-14" style={{ gap: 14 }}>
            <InfoBlock label="보낼 곳">
              <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink">
                {form.returnTo.name} · {form.returnTo.contact}
              </Typography>
              <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink76">
                {returnAddress}
              </Typography>
              <View className="flex-row" style={{ marginTop: 8 }}>
                <SmallOutlineButton
                  label="주소 복사"
                  onPress={() => copyToClipboard(returnAddress, "주소를 복사했어요")}
                />
              </View>
            </InfoBlock>
            {!isReturn && !!reshipLines && (
              <InfoBlock label="받을 곳">
                <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink">
                  {reshipLines.head}
                </Typography>
                <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink76">
                  {reshipLines.body}
                </Typography>
                <View className="flex-row" style={{ marginTop: 8 }}>
                  <SmallOutlineButton label="배송지 변경" onPress={handleChangeReshipAddress} />
                </View>
              </InfoBlock>
            )}
            <InfoBlock label="택배비">
              <Typography
                style={{ fontSize: 13, lineHeight: 20.8 }}
                className={reason ? "text-ink" : "text-gray45"}
              >
                {courierLine}
              </Typography>
            </InfoBlock>
          </View>

          <Band marginTop={20} />

          {isReturn ? (
            <>
              <SectionTitle title="환불 정보" style={{ paddingTop: 20 }} />
              <View className="px-14 pt-14" style={{ gap: 9 }}>
                <AmountRow label="결제 금액" value={won(sum)} />
                <AmountRow
                  label="배송비 차감"
                  value={deductionText}
                  valueColor={deductionColor(!!reason, fee)}
                />
              </View>
              <TotalRow label="환불 예정 금액" value={won(Math.max(0, sum - fee))} />
              {!!form.refundMethodLabel && (
                <View className="px-14 pt-10">
                  <AmountRow label="환불 수단" value={form.refundMethodLabel} />
                </View>
              )}
              <View
                className="mx-14 border-t-[0.5px] border-dividerProduct"
                style={{ marginTop: 16, paddingTop: 14 }}
              >
                <BulletNotes
                  fontSize={11.5}
                  style={{ gap: 6 }}
                  notes={[
                    ...(form.fees.consumerFault > 0
                      ? [
                          `무료배송으로 받은 주문을 단순 변심 · 주문 실수로 반품하면 최초 배송비 ${won(
                            form.fees.consumerFault
                          )}이 차감돼요.`,
                        ]
                      : []),
                    "함께 받은 사은품도 모두 보내주세요. 빠지면 환불이 늦어질 수 있어요.",
                    "상자에 현금은 넣지 마세요. 반송 택배비는 택배사에 직접 결제해요.",
                    "환불은 검수 완료 후 영업일 3–5일 안에 결제 수단으로 돌아가요.",
                  ]}
                />
              </View>
            </>
          ) : (
            <>
              <SectionTitle title="결제 금액" style={{ paddingTop: 20 }} />
              <View className="px-14 pt-14">
                <AmountRow label="재발송 배송비" value={!reason ? "사유 선택 후 계산" : won(fee)} />
              </View>
              <TotalRow label="결제 금액" value={won(fee)} />
              {needPay ? (
                <>
                  <Band marginTop={20} />
                  <SectionTitle title="결제 수단" style={{ paddingTop: 20 }} />
                  <PaymentMethodPicker
                    sheetId={PAYMENT_SHEET_ID}
                    methods={paymentMethods}
                    value={payment}
                    onChange={setPayment}
                    issuerSheet="grid"
                    easyPayLabelSize={14.5}
                  />
                </>
              ) : (
                <View className="px-14 pt-10">
                  <AmountRow label="결제 수단" value={paymentSelectionLabel(payment) || "결제 없음"} />
                </View>
              )}
              <View
                className="mx-14 border-t-[0.5px] border-dividerProduct"
                style={{ marginTop: 16, paddingTop: 14 }}
              >
                <BulletNotes
                  fontSize={11.5}
                  style={{ gap: 6 }}
                  notes={[
                    `단순 변심 · 주문 실수로 교환하면 새 상품을 보내는 배송비${
                      form.fees.consumerFault > 0 ? ` ${won(form.fees.consumerFault)}` : ""
                    }을 요청할 때 결제해요. 반송 택배비는 택배사에 직접 결제해요.`,
                    "같은 상품의 다른 옵션으로만 교환할 수 있어요. 다른 상품을 원하시면 반품 후 새로 주문해 주세요.",
                    "상자에 현금은 넣지 마세요.",
                  ]}
                />
              </View>
            </>
          )}
          <View className="h-26" />
        </ScrollView>

        <BottomCta
          label={ctaLabel}
          enabled={ready}
          loading={isSubmitting || claimPayment.isConfirming}
          onPress={handlePressCta}
        />

        <PortOnePaymentModal
          payment={claimPayment.paymentWindow}
          onComplete={paymentId => void claimPayment.confirm(paymentId)}
          onClose={paymentId => void claimPayment.confirm(paymentId)}
          onError={() => {
            claimPayment.openPaymentWindow(null);
            toast.show("결제창을 열지 못했어요. 다시 시도해 주세요.");
          }}
        />

        {receiptClaimId !== null && (
          <ClaimReceipt
            claimId={receiptClaimId}
            invoiceDueDays={form.invoiceDueDays}
            onClose={navigation.goBack}
            onPressDetail={() => navigation.replace(COMMON_ROUTES.CLAIM_DETAIL, { claimId: receiptClaimId })}
            onPressOrderList={() => mainNavigation.navigate(ROOT_ROUTES.HOME)}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

/** 신청 정보 한 덩어리 — 라벨 열 72 고정 */
function InfoBlock(props: { label: string; children: ReactNode }) {
  return (
    <View className="flex-row" style={{ gap: 12 }}>
      <Typography style={{ width: 72, fontSize: 13, lineHeight: 20.8 }} className="text-gray45">
        {props.label}
      </Typography>
      <View className="min-w-0 flex-1">{props.children}</View>
    </View>
  );
}

/** 배송비 차감 금액 색 — 차감이 있으면 로즈 텍스트, 사유 전이면 회색 */
function deductionColor(hasReason: boolean, fee: number) {
  if (fee > 0) {
    return "#CF3D61";
  }
  return hasReason ? "#0F0F0F" : "#737373";
}
