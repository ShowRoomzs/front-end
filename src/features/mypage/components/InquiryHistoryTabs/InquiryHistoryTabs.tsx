import { useCallback } from "react";
import { ListRenderItemInfo } from "react-native";

import Tabs, { TabItemType, TabProps } from "@/common/components/Tabs/Tabs";
import InquiryHistoryTabItem from "@/features/mypage/components/InquiryHistoryTabs/InquiryHistoryTabItem";

type InquiryHistoryTabsProps = Pick<TabProps, "items" | "selectedIndex" | "onSelect">;

export default function InquiryHistoryTabs(props: InquiryHistoryTabsProps) {
  const { items, selectedIndex, onSelect } = props;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TabItemType>) => {
      const isActive = item.id === items[selectedIndex ?? 0].id;

      return (
        <InquiryHistoryTabItem
          id={item.id}
          label={item.label}
          itemLength={items.length}
          isActive={isActive}
        />
      );
    },
    [selectedIndex, items]
  );

  return (
    <Tabs
      headerClassName="border-b-[0.5px] border-divider bg-white"
      bodyClassName="flex-1"
      items={items}
      renderItem={renderItem}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      enableHeaderScroll={false}
    />
  );
}
