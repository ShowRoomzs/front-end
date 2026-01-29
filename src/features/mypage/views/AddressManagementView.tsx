import { useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import AddressCard from "@/features/mypage/components/AddressCard/AddressCard";
import AddressManagementHeader from "@/features/mypage/components/AddressManagementHeader/AddressManagementHeader";
import { useAddressMutation } from "@/features/mypage/hooks/useAddressMutation/useAddressMutation";
import { useGetAddressList } from "@/features/mypage/hooks/useGetAddressList";
import { Address } from "@/features/mypage/types/address";

export default function AddressManagementView() {
  const navigation = useMypageNavigation();
  const { data: addressList } = useGetAddressList();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();
  const { defaultAddressMutation, deleteAddressMutation } = useAddressMutation();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddAddressPress = useCallback(() => {
    navigation.navigate(MYPAGE_ROUTES.ADDRESS_FORM);
  }, [navigation]);

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  const handlePressDefaultAddress = useCallback(
    (address: Address) => {
      /**
       * 해당 함수 호출, 성공 시 캐시 초기화 > 리스트 업데이트 중이나,
       * 반응속도 느리다면 추후 낙관적 업데이트 적용 필요
       */
      defaultAddressMutation.mutateAsync(address.id);
    },
    [defaultAddressMutation]
  );

  const handlePressEdit = useCallback(
    (address: Address) => {
      navigation.navigate(MYPAGE_ROUTES.ADDRESS_FORM, { addressId: address.id });
    },
    [navigation]
  );

  const handlePressDelete = useCallback(
    (address: Address) => {
      deleteAddressMutation.mutateAsync(address.id);
    },
    [deleteAddressMutation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Address }) => {
      return (
        <AddressCard
          address={item}
          onPressDefaultAddress={handlePressDefaultAddress}
          onPressEdit={handlePressEdit}
          onPressDelete={handlePressDelete}
        />
      );
    },
    [handlePressDefaultAddress, handlePressDelete, handlePressEdit]
  );

  return (
    <View className="flex-1">
      <AddressManagementHeader
        title="배송지 관리"
        wrapperClassName="px-20"
        onAddAddressPress={handleAddAddressPress}
        onBackPress={handleBackPress}
      />
      <FlatList
        contentContainerStyle={{ padding: 20, gap: 10 }}
        className="bg-gray0"
        data={addressList}
        renderItem={renderItem}
      />
    </View>
  );
}
