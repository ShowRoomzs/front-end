import { useMemo } from "react";
import { Text, View } from "react-native";

import Search from "@/common/components/Search/Search";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import VStack from "@/common/components/VStack/VStack";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import HomeHeader from "@/features/home/components/HomeHeader/HomeHeader";
import HomeTabs from "@/features/home/components/HomeTabs/HomeTabs";
import ShowroomView from "@/features/home/views/ShowroomView";

export default function HomeView() {
  const navigation = useMainNavigation();
  const tabItems = useMemo(
    (): Array<TabItemType> => [
      {
        id: "showroom",
        label: "쇼룸",
        render: <ShowroomView />,
      },
      {
        id: "ranking",
        label: "랭킹",
        render: (
          <View className="flex-1">
            <Text>랭킹</Text>
          </View>
        ),
      },
    ],
    []
  );

  const handlePressNotification = usePermissionPress(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.NOTIFICATION,
    });
  });

  return (
    <View className="flex-1 bg-white">
      <VStack gap={10} className="px-20">
        <HomeHeader onPressCart={() => {}} onPressNotification={handlePressNotification} />
        <Search onPressSearch={() => {}} placeholder="원하는 제품을 빠르게 찾아 보세요" size="medium" />
      </VStack>
      <View className="flex-1 mt-5">
        <HomeTabs items={tabItems} />
      </View>
    </View>
  );
}
