import { useCallback, useMemo } from "react";
import { ListRenderItemInfo, View } from "react-native";

import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useCategory } from "@/features/category/hooks/useCategory";
import RecommendedProductList from "@/features/home/components/RecommendedProductList/RecommendedProductList";
import RecommendedTabItem from "@/features/home/components/RecommendedTabItem/RecommendedTabItem";

interface RecommendedProductsProps {
  containerClassName?: string;
}

export default function RecommendedProducts(props: RecommendedProductsProps) {
  const { containerClassName } = props;
  const { categoryMap } = useCategory();
  const { selectedTabIndex, updateTabIndex } = useTabIndex();

  const tabItems = useMemo((): Array<TabItemType> => {
    if (!categoryMap?.mainCategories.length) {
      return [];
    }
    return [
      {
        id: "all",
        label: "전체",
        render: () => <RecommendedProductList categoryId={null} />,
      },
      ...categoryMap.mainCategories.map(category => ({
        id: category.categoryId.toString(),
        label: category.name,
        render: () => <RecommendedProductList categoryId={category.categoryId} />,
      })),
    ];
  }, [categoryMap?.mainCategories]);

  const renderTabHeader = useCallback(
    (item: ListRenderItemInfo<TabItemType>) => {
      const { item: tabItem, index } = item;

      return <RecommendedTabItem item={tabItem} isActive={index === selectedTabIndex} />;
    },
    [selectedTabIndex]
  );

  return (
    <VStack gap={10} className={containerClassName}>
      <Typography className="text-black text-16 font-semibold px-20">추천 상품</Typography>
      <View className="flex flex-col">
        <TabHeader
          items={tabItems}
          selectedIndex={selectedTabIndex}
          onPressTab={updateTabIndex}
          keyExtractor={item => item.id}
          renderItem={renderTabHeader}
          wrapperClassName="px-20 pb-10 border-b border-gray2"
          showUnderline={false}
          gap={4}
        />
        <TabBody items={tabItems} selectedIndex={selectedTabIndex} onChangeIndex={updateTabIndex} />
      </View>
    </VStack>
  );
}
