import { useMemo } from "react";
import { Text, View } from "react-native";

import Search from "@/common/components/Search/Search";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import VStack from "@/common/components/VStack/VStack";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import HomeHeader from "@/features/home/components/HomeHeader/HomeHeader";
import HomeTabs from "@/features/home/components/HomeTabs/HomeTabs";
import ShowroomView from "@/features/home/views/ShowroomView";

export default function HomeView() {
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
    // TODO : 알림 페이지로 이동
  });

  return (
    <View className="flex-1 bg-white">
      <VStack gap={10} className="mt-3 px-20">
        <HomeHeader onPressCart={() => {}} onPressNotification={handlePressNotification} />
        <Search onPressSearch={() => {}} placeholder="원하는 제품을 빠르게 찾아 보세요" size="medium" />
      </VStack>
      <View className="flex-1 mt-5">
        <HomeTabs items={tabItems} />
      </View>
    </View>
  );
}
