import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { queryClient } from "@/common/lib/queryClient";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import CarrierSheet from "@/features/order/components/CarrierSheet/CarrierSheet";
import {
  Band,
  BottomCta,
  BulletNotes,
  CloseHeader,
  FieldTitle,
  SectionTitle,
  SelectField,
  SmallOutlineButton,
} from "@/features/order/components/OrderParts/OrderParts";
import { CONSUMER_CARRIERS } from "@/features/order/constants/carriers";
import { ORDER_QUERY_KEY } from "@/features/order/constants/queryKey";
import { invalidateOrderQueries, useGetClaimDetail } from "@/features/order/hooks/useOrderQueries";
import { claimService } from "@/features/order/services/claimService";
import { DeliveryCarrierCode } from "@/features/order/types/claim";
import { copyToClipboard } from "@/features/order/utils/copyToClipboard";
import { resolveErrorMessage } from "@/features/order/utils/orderFormat";

/**
 * 회수 송장 등록 — C10-5 [회수 송장 등록]과 C10-4 [송장 수정]이 같은 화면을 쓴다(수정이면 값이 채워진 채 열린다).
 *
 * 택배사는 **추적 연동 업체 목록에서만** 고른다 — 자유 입력·수기 송장을 받으면 추적 API로 회수
 * 상황을 갱신할 수 없다. 등록은 요청(박스) 단위로 적용된다.
 *
 * 보내실 주소를 이 화면에 다시 적는다 — 송장 접수 때 이 화면만 보고 쓰면 되게 하려는 것이다.
 */
const CARRIER_SHEET_ID = "claim-invoice-carrier";

export default function ClaimInvoiceView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.CLAIM_INVOICE>>();
  const { claimId } = params;
  const { data: detail } = useGetClaimDetail(claimId);
  const { close: closeSheet } = useBottomSheetContext();

  const [carrier, setCarrier] = useState<DeliveryCarrierCode | null>(params.carrier ?? null);
  const [trackingNumber, setTrackingNumber] = useState(params.trackingNumber ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickCarrier = useCallback(
    (code: DeliveryCarrierCode) => {
      setCarrier(code);
      closeSheet();
    },
    [closeSheet]
  );

  const { open: openCarrierSheet } = useBottomSheet({
    id: CARRIER_SHEET_ID,
    render: <CarrierSheet carriers={CONSUMER_CARRIERS} selected={carrier} onPick={handlePickCarrier} />,
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const canSubmit = !!carrier && trackingNumber.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!carrier || !canSubmit || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await claimService.putCollectionInvoice(claimId, {
        carrier,
        trackingNumber: trackingNumber.replace(/\D/g, ""),
      });

      queryClient.setQueryData([ORDER_QUERY_KEY.CLAIM_DETAIL, claimId], updated);
      invalidateOrderQueries();
      toast.show("회수 송장이 등록되었어요");
      navigation.goBack();
    } catch (error) {
      toast.show(resolveErrorMessage(error, "송장을 등록하지 못했어요. 입력한 내용을 확인해 주세요."));
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, carrier, claimId, isSubmitting, navigation, trackingNumber]);

  const returnTo = detail?.info.returnTo;
  const returnAddress = returnTo
    ? `${returnTo.address}${returnTo.detailAddress ? ` ${returnTo.detailAddress}` : ""}`
    : "";

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <CloseHeader title="회수 송장 등록" onClose={navigation.goBack} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="px-14 pt-18">
            <FieldTitle label="택배사" />
            <View style={{ marginTop: 9 }}>
              <SelectField
                value={CONSUMER_CARRIERS.find(item => item.code === carrier)?.label}
                placeholder="택배사를 선택해 주세요"
                onPress={openCarrierSheet}
              />
            </View>

            <View style={{ marginTop: 18 }}>
              <FieldTitle label="송장 번호" />
            </View>
            <View
              className="h-48 flex-row items-center rounded-base border-[1px] border-borderButton px-13"
              style={{ marginTop: 9 }}
            >
              <TextInput
                value={trackingNumber}
                onChangeText={text => setTrackingNumber(text.replace(/[^\d\s-]/g, ""))}
                placeholder="송장 번호를 입력해 주세요"
                placeholderTextColor="#B5B5B5"
                keyboardType="number-pad"
                maxLength={30}
                className="m-0 flex-1 p-0 text-ink"
                style={{ fontSize: 14.5, fontFamily: "Pretendard-Regular" }}
              />
            </View>
            <Typography style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 8 }} className="text-gray45">
              숫자만 입력해 주세요 · 택배 영수증의 운송장 번호예요
            </Typography>
          </View>

          <Band marginTop={20} />

          <SectionTitle title="보내실 주소" />
          {!!returnTo && (
            <>
              <Typography style={{ fontSize: 13.5, lineHeight: 22.95 }} className="px-14 pt-12 text-ink">
                {`${returnTo.name} / ${returnTo.contact}\n${returnAddress}`}
              </Typography>
              <View className="flex-row px-14 pt-8">
                <SmallOutlineButton
                  label="주소 복사"
                  onPress={() => copyToClipboard(returnAddress, "주소를 복사했어요")}
                />
              </View>
            </>
          )}

          <View
            className="mx-14 border-t-[0.5px] border-dividerProduct"
            style={{ marginTop: 20, paddingTop: 16 }}
          >
            <BulletNotes
              notes={[
                "보내신 상품의 운송장 정보를 입력해 주세요. 입력하면 회수 상황이 자동으로 업데이트돼요.",
                "택배사에서 배송 완료가 되어도 브랜드 입고·검수까지 1~3일이 더 걸릴 수 있어요.",
                "반송 택배비는 택배사에 직접 결제해 주세요. 상자에 현금은 넣지 마세요.",
              ]}
              style={{ gap: 6 }}
            />
          </View>
          <View className="h-26" />
        </ScrollView>

        <BottomCta label="등록하기" enabled={canSubmit} loading={isSubmitting} onPress={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}
