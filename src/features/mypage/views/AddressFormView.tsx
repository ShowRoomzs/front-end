import { RouteProp, useRoute } from "@react-navigation/native";
import { produce } from "immer";
import { useCallback, useMemo, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";
import HStack from "@/common/components/HStack/HStack";
import Input from "@/common/components/Input/Input";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import VStack from "@/common/components/VStack/VStack";
import { useAddressSearch } from "@/common/providers/AddressSearchProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import { formatPhoneNumber } from "@/features/auth/utils/formatPhoneNumber";
import AddressManagementHeader from "@/features/mypage/components/AddressManagementHeader/AddressManagementHeader";
import { useAddressMutation } from "@/features/mypage/hooks/useAddressMutation";
import { AddressRequest } from "@/features/mypage/types/address";

const INITIAL_ADDRESS: AddressRequest = {
  recipientName: "",
  zipCode: "",
  address: "",
  detailAddress: "",
  phoneNumber: "",
  isDefault: false,
};

export default function AddressFormView() {
  const route = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.ADDRESS_FORM>>();
  const inset = useSafeAreaInsets();
  const addressId = route.params?.addressId;
  const isEdit = !!addressId;
  const [address, setAddress] = useState<AddressRequest>(INITIAL_ADDRESS);
  const title = isEdit ? "배송지 수정" : "배송지 추가";
  const detailAddressInputRef = useRef<TextInput>(null);
  const { addAddressMutation, updateAddressMutation } = useAddressMutation();
  const navigation = useMypageNavigation();
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const { openAddressSearch } = useAddressSearch();

  const handleSelectAddress = useCallback((data: DaumPostcodeData) => {
    setAddress(
      produce(draft => {
        // J > 지번, R > 도로명
        const address = data.userSelectedType === "J" ? data.jibunAddress : data.roadAddress;

        draft.address = address;
        draft.zipCode = data.zonecode; // 우편번호
      })
    );
    detailAddressInputRef.current?.focus();
  }, []);

  const handlePressFindAddress = useCallback(() => {
    openAddressSearch(handleSelectAddress);
  }, [handleSelectAddress, openAddressSearch]);

  const handleChangeRecipientName = useCallback((text: string) => {
    setAddress(
      produce(draft => {
        draft.recipientName = text;
      })
    );
  }, []);

  const handleChangeDetailAddress = useCallback((text: string) => {
    setAddress(
      produce(draft => {
        draft.detailAddress = text;
      })
    );
  }, []);

  const handleChangePhoneNumber = useCallback((text: string) => {
    setAddress(
      produce(draft => {
        draft.phoneNumber = text;
      })
    );
  }, []);

  const enableValidation = useMemo(() => {
    return (Object.keys(address) as Array<keyof AddressRequest>).every(key => {
      const value = address[key];

      if (key === "isDefault") {
        return true;
      }
      if (key === "phoneNumber") {
        return value.toString().length === 11;
      }
      return !!value;
    });
  }, [address]);

  const handleSubmit = useCallback(async () => {
    const parsedAddress: AddressRequest = {
      ...address,
      phoneNumber: formatPhoneNumber(address.phoneNumber),
    };

    const apiFn = isEdit
      ? updateAddressMutation.mutateAsync({ addressId, address: parsedAddress })
      : addAddressMutation.mutateAsync(parsedAddress);

    await apiFn;
    navigation.goBack();
  }, [addAddressMutation, address, addressId, isEdit, navigation, updateAddressMutation]);

  return (
    <View className="flex-1">
      <AddressManagementHeader
        title={title}
        wrapperClassName="px-20"
        onBackPress={handleBackPress}
        showAddButton={false}
      />
      <VStack gap={20} className="flex-1 py-25 px-20 pb-24">
        <LabeledInput
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={address.recipientName}
          onChangeText={handleChangeRecipientName}
        />
        <VStack gap={10}>
          <LabeledComponent label="배송지 입력">
            <HStack gap={10}>
              <View className="flex-1">
                <Input
                  readOnly
                  onPress={handlePressFindAddress}
                  value={address.address}
                  placeholder="주소를 입력해 주세요"
                />
              </View>
              <Button onPress={handlePressFindAddress} size="lg" variant="outline" className="px-15">
                주소 찾기
              </Button>
            </HStack>
          </LabeledComponent>
          <Input
            ref={detailAddressInputRef}
            value={address.detailAddress}
            placeholder="상세 주소를 입력해 주세요"
            onChangeText={handleChangeDetailAddress}
          />
        </VStack>
        <LabeledInput
          label="전화번호"
          value={address.phoneNumber}
          onChangeText={handleChangePhoneNumber}
          keyboardType="numeric"
          maxLength={11}
          numericOnly={{ maxLength: 11 }}
          placeholder="전화번호를 입력해 주세요"
        />
      </VStack>
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-20"
        style={{ paddingBottom: 10 + inset.bottom }}
      >
        <Button size="xl" variant="primary" onPress={handleSubmit} disabled={!enableValidation}>
          {`배송지 ${isEdit ? "수정" : "입력"}하기`}
        </Button>
      </View>
    </View>
  );
}
