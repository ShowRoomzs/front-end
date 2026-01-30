import { useCallback, useMemo } from "react";
import { ListRenderItemInfo, View } from "react-native";

import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { CleanupFn } from "@/common/types/cleanup";
import { useCategory } from "@/features/category/hooks/useCategory";
import WishlistProductList from "@/features/wishlist/components/WishlistProductList/WishlistProductList";
import WishlistProductTabHeader from "@/features/wishlist/components/WishlistProductTabHeader/WishlistProductTabHeader";

interface WishlistProductProps {
  onUpdateCallback?: (cleanupFns: Array<CleanupFn>) => void;
}

export default function WishlistProduct(props: WishlistProductProps) {
  const { onUpdateCallback } = props;
  const { categoryMap } = useCategory();
  const { selectedTabIndex, updateTabIndex } = useTabIndex();

  const tabItems: Array<TabItemType> = useMemo(() => {
    if (!categoryMap?.mainCategories?.length) {
      return [];
    }

    const tabs: Array<TabItemType> = [
      {
        id: "all",
        label: "전체",
        render: () => <WishlistProductList categoryId={null} onUpdateCallback={onUpdateCallback} />,
      },
    ];

    tabs.push(
      ...categoryMap.mainCategories.map(category => ({
        id: category.categoryId.toString(),
        label: category.name,
        render: () => (
          <WishlistProductList categoryId={category.categoryId} onUpdateCallback={onUpdateCallback} />
        ),
      }))
    );

    return tabs;
  }, [categoryMap?.mainCategories, onUpdateCallback]);

  const renderTabHeader = useCallback(
    (item: ListRenderItemInfo<TabItemType>) => {
      const { item: tabItem, index } = item;

      return (
        <WishlistProductTabHeader
          item={tabItem}
          isActive={index === selectedTabIndex}
          wrapperClassName={index < tabItems.length - 1 ? "mr-4" : ""}
        />
      );
    },
    [selectedTabIndex, tabItems.length]
  );

  return (
    <View className="flex-1">
      <Tabs
        items={tabItems}
        selectedIndex={selectedTabIndex}
        onSelect={updateTabIndex}
        renderItem={renderTabHeader}
        showUnderline={false}
        skipIntermediateTabs
        headerClassName="p-10 border-b border-gray2"
        bodyClassName="flex-1"
        scrollable
      />
    </View>
  );
}
