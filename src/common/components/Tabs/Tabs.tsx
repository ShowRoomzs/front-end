import { ReactElement, useCallback, useRef, useState } from "react";
import { FlatList, ListRenderItem, Pressable, Text, View } from "react-native";

import TabBody from "./TabBody";
import TabHeader from "./TabHeader";

import { cn } from "@/common/utils/cn";

export interface TabItemType {
  id: string;
  label: string;
  render: ReactElement;
}

interface TabProps {
  items: Array<TabItemType>;
  headerClassName?: string;
  bodyClassName?: string;
  selectedIndex?: number;
  onSelect?: (index: number, id: string) => void;
  skipIntermediateTabs?: boolean; // 탭 전환 시 중간 탭 건너뛰기
}

export default function Tabs(props: TabProps) {
  const {
    items,
    bodyClassName,
    headerClassName,
    onSelect,
    selectedIndex: originSelectedIndex,
    skipIntermediateTabs = false,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(originSelectedIndex || 0);
  const listScrollRef = useRef<FlatList>(null);

  const handlePressTab = useCallback(
    (index: number, id: string) => {
      const diff = Math.abs(index - selectedIndex);

      if (diff === 0) {
        return;
      }

      onSelect?.(index, id);
      setSelectedIndex(index);
      listScrollRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true,
      });
    },
    [onSelect, selectedIndex]
  );

  const handleChangeIndex = useCallback(
    (index: number) => {
      handlePressTab(index, items[index].id);
    },
    [handlePressTab, items]
  );

  const renderItem: ListRenderItem<TabItemType> = useCallback(
    data => {
      const { item, index } = data;
      const isActive = index === selectedIndex;

      return (
        <View className="flex flex-col">
          <Pressable onPress={() => handlePressTab(index, item.id)} className="px-2 py-2 items-center">
            <Text className={cn(isActive ? "font-bold" : "", "text-base")}>{item.label}</Text>
          </Pressable>
          {isActive && <View className="w-full h-0.5 bg-black" />}
        </View>
      );
    },
    [handlePressTab, selectedIndex]
  );

  const keyExtractor = useCallback((item: TabItemType) => item.id, []);

  return (
    <View className="flex-1">
      <TabHeader
        items={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        listScrollRef={listScrollRef}
        className={headerClassName}
      />
      <TabBody
        className={bodyClassName}
        items={items}
        selectedIndex={selectedIndex}
        onChangeIndex={handleChangeIndex}
        skipIntermediateTabs={skipIntermediateTabs}
      />
    </View>
  );
}
