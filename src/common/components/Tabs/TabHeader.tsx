import { RefObject } from "react";
import { FlatList, ListRenderItem, View } from "react-native";

import { TabItemType } from "./Tabs";

import { cn } from "@/common/utils/cn";

interface TabHeaderProps {
  className?: string;
  listScrollRef: RefObject<FlatList | null>;
  items: Array<TabItemType>;
  renderItem: ListRenderItem<TabItemType>;
  keyExtractor: (item: TabItemType) => string;
}

export default function TabHeader(props: TabHeaderProps) {
  const { className, items, keyExtractor, renderItem, listScrollRef } = props;

  return (
    <View className={cn("w-full", className)}>
      <FlatList
        ref={listScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}
