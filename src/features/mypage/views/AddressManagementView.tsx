import { useCallback, useEffect } from "react";
import { FlatList, Text, View } from "react-native";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import AddressManagementHeader from "@/features/mypage/components/AddressManagementHeader/AddressManagementHeader";
import { useGetAddressList } from "@/features/mypage/hooks/useGetAddressList";
import { Address } from "@/features/mypage/types/address";

export default function AddressManagementView() {
  const navigation = useMypageNavigation();
  const { data: addressList } = useGetAddressList();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();

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

  const renderItem = useCallback(({ item }: { item: Address }) => {
    return (
      <View>
        <Text>{item.recipientName}</Text>
      </View>
    );
  }, []);

  return (
    <View className="flex-1">
      <AddressManagementHeader
        title="배송지 관리"
        wrapperClassName="px-20"
        onAddAddressPress={handleAddAddressPress}
        onBackPress={handleBackPress}
      />
      <FlatList data={addressList} renderItem={renderItem} />
    </View>
  );
}
