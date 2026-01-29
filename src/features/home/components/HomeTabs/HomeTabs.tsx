import { useCallback } from "react";
import { ListRenderItemInfo } from "react-native";

import Tabs, { TabItemType, TabProps } from "@/common/components/Tabs/Tabs";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import HomeTabItem from "@/features/home/components/HomeTabs/HomeTabItem";

type HomeTabsProps = Pick<TabProps, "items">;

export default function HomeTabs(props: HomeTabsProps) {
  const { items } = props;
  const { selectedTabIndex, updateTabIndex } = useTabIndex(0);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TabItemType>) => {
      const isActive = item.id === items[selectedTabIndex ?? 0].id;

      return <HomeTabItem id={item.id} label={item.label} itemLength={items.length} isActive={isActive} />;
    },
    [selectedTabIndex, items]
  );

  return (
    <Tabs
      headerClassName="min-h-[48px]"
      bodyClassName="min-h-screen"
      items={items}
      renderItem={renderItem}
      selectedIndex={selectedTabIndex}
      onSelect={updateTabIndex}
      enableHeaderScroll={false}
    />
  );
}
