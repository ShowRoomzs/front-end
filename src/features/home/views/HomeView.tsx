import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header/Header";
import HomeTabs from "../components/HomeTabs/HomeTabs";

import Search from "@/common/components/Search/Search";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import VStack from "@/common/components/VStack/VStack";

export default function HomeView() {
  const tabItems = useMemo(
    (): Array<TabItemType> => [
      {
        id: "showroom",
        label: "쇼룸",
        render: (
          <View className="flex-1">
            <Text>쇼룸</Text>
          </View>
        ),
      },
      {
        id: "brand",
        label: "브랜드",
        render: (
          <View className="flex-1">
            <Text>브랜드</Text>
          </View>
        ),
      },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack gap={10} className="mt-3 px-20">
        <Header onPressCart={() => {}} onPressNotification={() => {}} />
        <Search onPressSearch={() => {}} placeholder="원하는 제품을 빠르게 찾아 보세요" size="medium" />
      </VStack>
      <View className="flex-1">
        <HomeTabs items={tabItems} />
      </View>
    </SafeAreaView>
  );
}
