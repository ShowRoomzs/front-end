import { useCallback } from "react";
import { View } from "react-native";

import { useMypageNavigation } from "@/common/router";
import AddressManagementHeader from "@/features/mypage/components/AddressManagementHeader/AddressManagementHeader";

export default function AddAddressView() {
  const navigation = useMypageNavigation();
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View className="flex-1">
      <AddressManagementHeader
        title="배송지 추가"
        wrapperClassName="px-20"
        onBackPress={handleBackPress}
        showAddButton={false}
      />
    </View>
  );
}
