import { RefObject, useCallback, useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import TabUnderline from "@/common/components/Tabs/TabUnderline";
import { cn } from "@/common/utils/cn";

interface TabHeaderProps {
  wrapperClassName?: string;
  listScrollRef: RefObject<FlatList | null>;
  items: Array<TabItemType>;
  renderItem: ListRenderItem<TabItemType>;
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
    renderItem,
    listScrollRef,
    enableHeaderScroll,
    showUnderline = true,
    underlineClassName,
    selectedIndex,
    onPressTab,
  } = props;

  const { width: screenWidth } = useWindowDimensions();

  const itemWidth = useMemo(() => {
    return screenWidth / items.length;
  }, [screenWidth, items.length]);

  const wrappedRenderItem = useCallback(
    (info: ListRenderItemInfo<TabItemType>) => {
      return <Pressable onPress={() => onPressTab(info.index, info.item.id)}>{renderItem(info)}</Pressable>;
    },
    [renderItem, onPressTab]
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
      />
      {showUnderline && (
        <TabUnderline
          selectedIndex={selectedIndex}
          itemWidth={itemWidth}
          underlineClassName={underlineClassName}
        />
      )}
    </View>
  );
}
