import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { useGetAddressList } from "@/features/mypage/hooks/useGetAddressList";
import { Address } from "@/features/mypage/types/address";
import { BottomCta } from "@/features/order/components/OrderParts/OrderParts";
import { RadioDot } from "@/features/order/components/PaymentMethodPicker/PaymentMethodPicker";

/**
 * C13-2 배송지 선택 — 관리 화면(C13)과 별개다.
 *
 * 진입은 세 곳 — C9 결제 [변경] · C10-1 주문 상세(결제완료만) [배송지 변경] · 교환 요청·상세의
 * 교환받을 배송지 [배송지 변경]. 목록은 C13과 같은 데이터지만 행 전체가 **단일 선택**(로즈 라디오 +
 * 틴트)이고, 행을 눌러도 수정으로 가지 않는다(수정은 우측 [수정] 링크).
 *
 * 지금 쓰는 주소가 처음부터 선택돼 있어 그대로면 버튼이 회색이고, 다른 주소를 골라야
 * [이 배송지로 변경]이 켜진다. [새 배송지 추가]로 저장하면 이 목록으로 돌아와 새 주소가 선택된다.
 */
export default function AddressSelectView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.ADDRESS_SELECT>>();
  const { selectedAddressId, matchAddress, onSelect } = params;
  const { data: addresses, isLoading } = useGetAddressList();

  /**
   * 주문·교환은 배송지 id가 아니라 값의 사본을 든다 — id가 없으면 우편번호·주소로 맞춰 본다.
   * 받는 분 이름은 비교하지 않는다(주문 상세가 주는 값은 마스킹돼 있을 수 있다).
   */
  const initialId = useMemo(() => {
    if (selectedAddressId) {
      return selectedAddressId;
    }
    if (!matchAddress || !addresses) {
      return undefined;
    }
    return addresses.find(
      address => address.zipCode === matchAddress.zipCode && address.address === matchAddress.address
    )?.id;
  }, [addresses, matchAddress, selectedAddressId]);

  const [pickedId, setPickedId] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pickedId === undefined && initialId !== undefined) {
      setPickedId(initialId);
    }
  }, [initialId, pickedId]);

  const picked = addresses?.find(address => address.id === pickedId);
  const canSubmit = !!picked && pickedId !== initialId;

  const handlePressAdd = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.ADDRESS_FORM, {
      onSaved: newId => {
        if (newId) {
          setPickedId(newId);
        }
      },
    });
  }, [navigation]);

  const handlePressEdit = useCallback(
    (address: Address) => {
      navigation.navigate(COMMON_ROUTES.ADDRESS_FORM, { addressId: address.id });
    },
    [navigation]
  );

  const handlePressSubmit = useCallback(async () => {
    if (!picked || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await onSelect(picked);

      if (result !== false) {
        navigation.goBack();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigation, onSelect, picked]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="배송지 선택" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-14 pb-4 pt-14">
          <TouchableOpacity
            onPress={handlePressAdd}
            activeOpacity={0.6}
            className="h-44 flex-row items-center justify-center rounded-base"
            style={{ borderWidth: 1, borderStyle: "dashed", borderColor: "#DCDCDE", gap: 6 }}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <Path d="M12 6v12" stroke="#3C3C3C" strokeWidth={2.2} strokeLinecap="round" />
              <Path d="M6 12h12" stroke="#3C3C3C" strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
              새 배송지 추가
            </Typography>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="items-center pt-40">
            <Spinner />
          </View>
        ) : (
          (addresses ?? []).map((address, ix) => {
            const isPicked = address.id === pickedId;

            return (
              <TouchableOpacity
                key={address.id}
                onPress={() => setPickedId(address.id)}
                activeOpacity={0.7}
                className="flex-row items-start px-14 py-16"
                style={{
                  gap: 11,
                  backgroundColor: isPicked ? "#FEF4F6" : "#FFFFFF",
                  ...(ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : null),
                }}
              >
                <View style={{ marginTop: 1 }}>
                  <RadioDot isSelected={isPicked} />
                </View>
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <Typography
                      style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 19.6 }}
                      className="text-ink"
                    >
                      {address.recipientName}
                    </Typography>
                    {address.default && (
                      <View className="rounded-base bg-roseTint px-8 py-4">
                        <Typography variant="badge" className="text-roseText">
                          기본 배송지
                        </Typography>
                      </View>
                    )}
                  </View>
                  <Typography
                    style={{ fontSize: 13, lineHeight: 20.15, marginTop: 5 }}
                    className="text-ink76"
                  >
                    {address.phoneNumber}
                  </Typography>
                  <Typography
                    style={{ fontSize: 13, lineHeight: 20.15, marginTop: 2 }}
                    className="text-ink76"
                  >
                    {`(${address.zipCode}) ${address.address}${address.detailAddress ? `, ${address.detailAddress}` : ""}`}
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => handlePressEdit(address)}
                  activeOpacity={0.55}
                  style={{ paddingVertical: 10, paddingLeft: 10, marginVertical: -10 }}
                >
                  <Typography
                    style={{
                      fontSize: 12.5,
                      fontWeight: "500",
                      lineHeight: 16.25,
                      textDecorationLine: "underline",
                    }}
                    className="text-gray45"
                  >
                    수정
                  </Typography>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <BottomCta
        label="이 배송지로 변경"
        enabled={canSubmit}
        loading={isSubmitting}
        onPress={handlePressSubmit}
      />
    </View>
  );
}
