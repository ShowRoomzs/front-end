import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";
import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SheetList from "@/common/components/SheetList/SheetList";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useAddressSearch } from "@/common/providers/AddressSearchProvider";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import { formatPhoneNumber, formatPhoneNumberInput } from "@/features/auth/utils/formatPhoneNumber";
import AddressFormField from "@/features/mypage/components/AddressFormField/AddressFormField";
import {
  DELIVERY_MEMO_CUSTOM,
  DELIVERY_MEMO_MAX_LENGTH,
  DELIVERY_MEMO_OPTIONS,
} from "@/features/mypage/constants/deliveryMemo";
import { useAddressMutation } from "@/features/mypage/hooks/useAddressMutation/useAddressMutation";
import { useGetAddressDetail } from "@/features/mypage/hooks/useGetAddressDetail";
import { AddressRequest } from "@/features/mypage/types/address";

/**
 * C13-1 배송지 추가 · 수정 — 받는 분 → 연락처 → 주소 → 배송 메모 → 기본 설정.
 *
 * 도로명은 **주소 검색 결과로만** 채워지는 필드라 직접 타이핑하지 않게 막았다. 직접 쓰게 두면
 * 오타와 지번/도로명 혼용이 그대로 송장에 실린다. 사용자가 쓰는 칸은 상세 주소뿐이고,
 * 검색을 마치면 상세 주소로 포커스가 넘어간다.
 *
 * [저장]은 필수 항목(받는 분 · 연락처 · 우편번호 · 도로명 · 상세 주소)이 모두 채워져야 켜진다.
 * 비었을 때 **버튼을 숨기지 않는 이유**는, 무엇을 향해 입력하는지가 보여야 끝이 예측되기 때문이다.
 * 배송 메모는 선택이라 조건에서 뺀다.
 */
const MEMO_SHEET_ID = "delivery-memo";
const PHONE_DIGITS = 11;
/** 하이픈 2개가 더 들어간다 — 010-1234-5678 */
const PHONE_INPUT_MAX_LENGTH = PHONE_DIGITS + 2;

const INITIAL_ADDRESS: AddressRequest = {
  recipientName: "",
  zipCode: "",
  address: "",
  detailAddress: "",
  phoneNumber: "",
  memo: "",
  default: false,
};

const MEMO_ITEMS = DELIVERY_MEMO_OPTIONS.map(option => ({ value: option, label: option }));

/** 저장된 메모가 프리셋이면 그 프리셋을, 아니면 [직접 입력]으로 되살린다 */
function resolveMemoSelection(memo: string | null) {
  if (!memo) {
    return { preset: null, custom: "" };
  }
  if (DELIVERY_MEMO_OPTIONS.includes(memo)) {
    return { preset: memo, custom: "" };
  }
  return { preset: DELIVERY_MEMO_CUSTOM, custom: memo };
}

export default function AddressFormView() {
  const navigation = useMypageNavigation();
  const route = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.ADDRESS_FORM>>();
  const { bottom } = useSafeAreaInsets();
  const { openAddressSearch } = useAddressSearch();
  const { close: closeMemoSheet } = useBottomSheetContext();

  const addressId = route.params?.addressId;
  const isEdit = !!addressId;
  const { data: addressDetail } = useGetAddressDetail(addressId);
  const { addAddressMutation, updateAddressMutation } = useAddressMutation();

  const detailAddressRef = useRef<TextInput>(null);
  const [form, setForm] = useState<AddressRequest>(INITIAL_ADDRESS);
  const [memoPreset, setMemoPreset] = useState<string | null>(null);
  const [customMemo, setCustomMemo] = useState("");

  useEffect(() => {
    if (!addressDetail) {
      return;
    }
    const { preset, custom } = resolveMemoSelection(addressDetail.memo);

    setForm({ ...addressDetail, phoneNumber: addressDetail.phoneNumber.replace(/\D/g, "") });
    setMemoPreset(preset);
    setCustomMemo(custom);
  }, [addressDetail]);

  const isCustomMemo = memoPreset === DELIVERY_MEMO_CUSTOM;
  const memoValue = isCustomMemo ? customMemo.trim() : (memoPreset ?? "");

  const handleSelectMemo = useCallback(
    (option: string) => {
      setMemoPreset(option);
      closeMemoSheet();
    },
    [closeMemoSheet]
  );

  const { open: openMemoSheet } = useBottomSheet({
    id: MEMO_SHEET_ID,
    render: (
      <SheetList
        title="배송 메모"
        items={MEMO_ITEMS}
        mode="select"
        selectedValue={memoPreset ?? undefined}
        onSelect={handleSelectMemo}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const handleSelectAddress = useCallback((data: DaumPostcodeData) => {
    // J > 지번, R > 도로명
    const selected = data.userSelectedType === "J" ? data.jibunAddress : data.roadAddress;

    setForm(prev => ({ ...prev, address: selected, zipCode: data.zonecode }));
    detailAddressRef.current?.focus();
  }, []);

  const handlePressSearchAddress = useCallback(() => {
    openAddressSearch(handleSelectAddress);
  }, [handleSelectAddress, openAddressSearch]);

  const canSave = useMemo(() => {
    const hasRequired =
      !!form.recipientName.trim() &&
      form.phoneNumber.length === PHONE_DIGITS &&
      !!form.zipCode &&
      !!form.address &&
      !!form.detailAddress.trim();

    if (!hasRequired) {
      return false;
    }
    if (!isEdit || !addressDetail) {
      return true;
    }

    // 수정은 바뀐 게 있을 때만 — 그대로 다시 보내 봐야 얻는 게 없다
    return (
      form.recipientName !== addressDetail.recipientName ||
      form.phoneNumber !== addressDetail.phoneNumber.replace(/\D/g, "") ||
      form.zipCode !== addressDetail.zipCode ||
      form.address !== addressDetail.address ||
      form.detailAddress !== addressDetail.detailAddress ||
      form.default !== addressDetail.default ||
      memoValue !== (addressDetail.memo ?? "")
    );
  }, [addressDetail, form, isEdit, memoValue]);

  const handlePressSave = useCallback(async () => {
    // 서버는 하이픈이 있는 전화번호만 받는다 — 화면은 숫자만 받고 여기서 맞춘다
    const payload: AddressRequest = {
      ...form,
      phoneNumber: formatPhoneNumber(form.phoneNumber),
      memo: memoValue,
    };

    try {
      if (isEdit) {
        await updateAddressMutation.mutateAsync({ addressId, address: payload });
        toast.show("배송지가 수정되었습니다");
      } else {
        await addAddressMutation.mutateAsync(payload);
        toast.show("배송지가 저장되었습니다");
      }
      navigation.goBack();
    } catch {
      toast.show("배송지를 저장하지 못했어요. 입력한 내용을 확인해 주세요");
    }
  }, [addAddressMutation, addressId, form, isEdit, memoValue, navigation, updateAddressMutation]);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <ScreenHeader title={isEdit ? "배송지 수정" : "배송지 추가"} onPressBack={navigation.goBack} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="px-14 pt-20">
            <AddressFormField
              label="받는 분"
              value={form.recipientName}
              placeholder="받는 분 이름을 입력해 주세요"
              onChangeText={recipientName => setForm(prev => ({ ...prev, recipientName }))}
              maxLength={64}
            />
          </View>

          <View className="px-14 pt-18">
            {/* 상태에는 숫자만 담고 화면에만 하이픈을 씌운다 — 비교·저장 로직이 형식에 흔들리지 않는다 */}
            <AddressFormField
              label="연락처"
              value={formatPhoneNumberInput(form.phoneNumber)}
              placeholder="010-1234-5678"
              onChangeText={text =>
                setForm(prev => ({ ...prev, phoneNumber: text.replace(/\D/g, "").slice(0, PHONE_DIGITS) }))
              }
              keyboardType="number-pad"
              maxLength={PHONE_INPUT_MAX_LENGTH}
            />
          </View>

          <View className="px-14 pt-18">
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
              주소
            </Typography>

            <View className="flex-row" style={{ gap: 8, marginTop: 9 }}>
              <View className="min-w-0 flex-1">
                <AddressFormField value={form.zipCode} placeholder="우편번호" readOnly />
              </View>
              <TouchableOpacity
                onPress={handlePressSearchAddress}
                activeOpacity={0.6}
                className="h-48 flex-row items-center rounded-base border-[1px] border-borderButton bg-white px-16"
              >
                <Typography
                  style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }}
                  className="text-ink76"
                >
                  주소 검색
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              <AddressFormField value={form.address} placeholder="주소 검색으로 입력돼요" readOnly />
            </View>

            <View style={{ marginTop: 8 }}>
              <AddressFormField
                ref={detailAddressRef}
                value={form.detailAddress}
                placeholder="상세 주소를 입력해 주세요"
                onChangeText={detailAddress => setForm(prev => ({ ...prev, detailAddress }))}
                maxLength={255}
              />
            </View>
          </View>

          <View className="px-14 pt-18">
            <View className="flex-row items-baseline">
              <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
                배송 메모
              </Typography>
              <Typography style={{ fontSize: 13, lineHeight: 13 }} className="text-gray45">
                {" (선택)"}
              </Typography>
            </View>

            <TouchableOpacity
              onPress={openMemoSheet}
              activeOpacity={0.6}
              className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
              style={{ marginTop: 9 }}
            >
              <Typography
                style={{ fontSize: 15, lineHeight: 15 }}
                className={memoPreset ? "text-ink" : "text-gray71"}
              >
                {memoPreset ?? "배송 메모를 선택해 주세요"}
              </Typography>
              <ChevronDownIcon size={14} color="#C7C7C7" />
            </TouchableOpacity>

            {isCustomMemo && (
              <>
                <View style={{ marginTop: 8 }}>
                  <AddressFormField
                    value={customMemo}
                    placeholder="배송 시 요청사항을 입력해 주세요"
                    onChangeText={setCustomMemo}
                    maxLength={DELIVERY_MEMO_MAX_LENGTH}
                  />
                </View>
                <View className="flex-row items-baseline justify-between" style={{ marginTop: 7 }}>
                  <Typography style={{ fontSize: 11.5, lineHeight: 17.25 }} className="text-gray45">
                    기사님께 그대로 전달돼요
                  </Typography>
                  <Typography
                    style={{ fontSize: 12, lineHeight: 12, paddingRight: 2 }}
                    className="text-gray45"
                  >
                    {customMemo.length}/{DELIVERY_MEMO_MAX_LENGTH}
                  </Typography>
                </View>
              </>
            )}
          </View>

          <View className="px-14 pt-16">
            <TouchableOpacity
              onPress={() => setForm(prev => ({ ...prev, default: !prev.default }))}
              activeOpacity={0.6}
              className="flex-row items-center py-8"
              style={{ gap: 10 }}
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 21,
                  height: 21,
                  borderWidth: 1.5,
                  borderColor: form.default ? "#F2456E" : "#DEDEE0",
                  backgroundColor: form.default ? "#F2456E" : "#FFFFFF",
                }}
              >
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4.5 12.5l5 5 10-11"
                    stroke={form.default ? "#FFFFFF" : "#DEDEE0"}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Typography
                style={{ fontSize: 13.5, fontWeight: "500", lineHeight: 13.5 }}
                className="min-w-0 flex-1 text-ink"
              >
                기본 배송지로 설정
              </Typography>
            </TouchableOpacity>
          </View>

          <View className="h-40" />
        </ScrollView>

        <View
          className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
          style={{ paddingBottom: bottom + 26 }}
        >
          <TouchableOpacity
            onPress={handlePressSave}
            disabled={!canSave}
            activeOpacity={0.75}
            className={`h-52 flex-row items-center justify-center rounded-base ${
              canSave ? "bg-rose" : "bg-fill"
            }`}
          >
            <Typography variant="buttonPrimary" className={canSave ? "text-white" : "text-gray71"}>
              저장
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
