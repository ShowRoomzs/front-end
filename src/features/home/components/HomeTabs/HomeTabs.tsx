import { useCallback, useState } from "react";
import { ListRenderItemInfo } from "react-native";

import HomeTabItem from "./HomeTabItem";

import Tabs, { TabItemType, TabProps } from "@/common/components/Tabs/Tabs";

type HomeTabsProps = Pick<TabProps, "items">;

export default function HomeTabs(props: HomeTabsProps) {
  const { items } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TabItemType>) => {
      const isActive = item.id === items[selectedIndex].id;

      return <HomeTabItem id={item.id} label={item.label} itemLength={items.length} isActive={isActive} />;
    },
    [selectedIndex, items]
  );

  return (
    <Tabs
      headerClassName="min-h-[43px]"
      bodyClassName="min-h-screen"
      items={items}
      renderItem={renderItem}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      enableHeaderScroll={false}
    />
  );
}
