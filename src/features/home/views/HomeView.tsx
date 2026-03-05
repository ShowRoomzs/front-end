import { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, ListRenderItemInfo, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import Search from "@/common/components/Search/Search";
import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import VStack from "@/common/components/VStack/VStack";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import HomeHeader from "@/features/home/components/HomeHeader/HomeHeader";
import HomeTabItem from "@/features/home/components/HomeTabItem/HomeTabItem";
import RecommendationsView from "@/features/home/views/RecommendationsView";

export default function HomeView() {
  const inset = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [contentHeightMap, setContentHeightMap] = useState<Record<string, number>>({
    recommendations: 0,
    ranking: 0,
  });

  const navigation = useMainNavigation();

  const tabItems = useMemo(
    (): Array<TabItemType> => [
      {
        id: "recommendations",
        label: "추천",
        render: () => <RecommendationsView />,
      },
      {
        id: "ranking",
        label: "랭킹",
        render: () => (
          <View>
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

  const handlePressSearch = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [navigation]);

  const handlePressCart = usePermissionPress(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  });

  const handleLayoutTabBodyContent = useCallback((key: string, e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;

    setContentHeightMap(prev => ({ ...prev, [key]: height }));
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TabItemType>) => {
      const isActive = item.id === tabItems[selectedIndex ?? 0].id;

      return <HomeTabItem id={item.id} label={item.label} itemLength={tabItems.length} isActive={isActive} />;
    },
    [selectedIndex, tabItems]
  );

  return (
    <ScrollView className="flex-1 bg-white" stickyHeaderIndices={[1]}>
      <VStack gap={10} className="px-20">
        <HomeHeader onPressCart={handlePressCart} onPressNotification={handlePressNotification} />
        <Search
          readOnly
          onPressSearch={handlePressSearch}
          placeholder="원하는 제품을 빠르게 찾아 보세요"
          size="medium"
        />
      </VStack>
      <TabHeader
        items={tabItems}
        keyExtractor={item => item.id}
        selectedIndex={selectedIndex}
        wrapperClassName="border-b-[1px] border-gray2 bg-white"
        onPressTab={setSelectedIndex}
        renderItem={renderItem}
      />
      <View style={{ paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}>
        <TabBody
          scrollable={false}
          wrapperClassName="flex-1"
          items={tabItems}
          selectedIndex={selectedIndex}
          onChangeIndex={setSelectedIndex}
          onLayout={handleLayoutTabBodyContent}
          style={{ height: contentHeightMap[tabItems[selectedIndex].id] }}
        />
      </View>
    </ScrollView>
  );
}
