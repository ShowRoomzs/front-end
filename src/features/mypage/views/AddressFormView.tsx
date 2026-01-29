import { RouteProp, useRoute } from "@react-navigation/native";
import { produce } from "immer";
import { useCallback, useRef, useState } from "react";
import { TextInput, View } from "react-native";

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
import AddressManagementHeader from "@/features/mypage/components/AddressManagementHeader/AddressManagementHeader";
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
  const addressId = route.params?.addressId;
  const isEdit = !!addressId;
  const [address, setAddress] = useState<AddressRequest>(INITIAL_ADDRESS);
  const title = isEdit ? "배송지 수정" : "배송지 추가";
  const detailAddressInputRef = useRef<TextInput>(null);
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

  return (
    <View className="flex-1">
      <AddressManagementHeader
        title={title}
        wrapperClassName="px-20"
        onBackPress={handleBackPress}
        showAddButton={false}
      />
      <VStack gap={20} className="py-25 px-20">
        <LabeledInput
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={address.recipientName}
          onChangeText={() => {}}
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
          maxLength={11}
          placeholder="전화번호를 입력해 주세요"
        />
      </VStack>
    </View>
  );
}
