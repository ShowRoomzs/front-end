import { ReactElement, useCallback, useRef, useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";

import TabBody from "./TabBody";
import TabHeader from "./TabHeader";

export interface TabItemType {
  id: string;
  label: string;
  render: ReactElement;
}

interface TabProps {
  items: Array<TabItemType>;
  renderItem: ListRenderItem<TabItemType>;
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
    renderItem,
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
