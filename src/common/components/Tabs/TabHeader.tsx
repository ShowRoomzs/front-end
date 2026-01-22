import { RefObject, useCallback } from "react";
import { FlatList, ListRenderItem, ListRenderItemInfo, Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import DefaultTabItem from "@/common/components/Tabs/DefaultTabItem";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import { cn } from "@/common/utils/cn";

interface TabHeaderProps {
  wrapperClassName?: string;
  listScrollRef: RefObject<FlatList | null>;
  items: Array<TabItemType>;
  renderItem?: ListRenderItem<TabItemType>;
  keyExtractor: (item: TabItemType) => string;
  enableHeaderScroll?: boolean;
  showUnderline?: boolean;
  underlineClassName?: string;
  selectedIndex: number;
  onPressTab: (index: number, id: string) => void;
}

export default function TabHeader(props: TabHeaderProps) {
  const {
    wrapperClassName,
    items,
    keyExtractor,
    renderItem: originRenderItem,
    listScrollRef,
    enableHeaderScroll,
    showUnderline = true,
    underlineClassName,
    selectedIndex,
    onPressTab,
  } = props;

  const renderItem = useCallback(
    (info: ListRenderItemInfo<TabItemType>) => {
      if (originRenderItem) {
        return originRenderItem(info);
      }
      return <DefaultTabItem item={info.item} isActive={info.index === selectedIndex} />;
    },
    [originRenderItem, selectedIndex]
  );

  const wrappedRenderItem = useCallback(
    (info: ListRenderItemInfo<TabItemType>) => {
      const isSelected = info.index === selectedIndex;

      return (
        <Pressable onPress={() => onPressTab(info.index, info.item.id)}>
          {renderItem(info)}
          {isSelected && showUnderline && (
            <Animated.View
              entering={FadeIn.duration(200)}
              className={cn("absolute bottom-0 h-2 bg-black left-0 right-0", underlineClassName)}
            />
          )}
        </Pressable>
      );
    },
    [renderItem, onPressTab, selectedIndex, showUnderline, underlineClassName]
  );

  return (
    <View className={cn("w-full", wrapperClassName)}>
      <FlatList
        ref={listScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={enableHeaderScroll}
        data={items}
        renderItem={wrappedRenderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={items.length}
      />
    </View>
  );
}
