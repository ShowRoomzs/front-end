import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, ListRenderItem, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { useTabs } from "@/common/hooks/useTabs";
import { cn } from "@/common/utils/cn";

export interface TabItemType {
  id: string;
  label: string;
  render: (id: string) => ReactElement;
}

export interface TabProps {
  items: Array<TabItemType>;
  renderItem?: ListRenderItem<TabItemType>;
  headerClassName?: string;
  bodyClassName?: string;
  selectedIndex?: number;
  onSelect?: (index: number, id: string) => void;
  skipIntermediateTabs?: boolean; // 탭 전환 시 중간 탭 건너뛰기
  showUnderline?: boolean;
  enableHeaderScroll?: boolean;
  underlineClassName?: string;
  enableTabTransitionAnimation?: boolean;
  className?: string;
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
    showUnderline = true,
    underlineClassName,
    enableHeaderScroll = true,
    enableTabTransitionAnimation = true,
    className,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(originSelectedIndex || 0);
  const listScrollRef = useRef<FlatList>(null);
  const { isVisible } = useTabs();
  const translateY = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : -headerHeight, { duration: 200 });
  }, [headerHeight, isVisible, translateY]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const bodyAnimatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      marginTop: translateY.value,
    };
  });

  const changeTabWithAnimation = useCallback(
    (index: number) => {
      const diff = Math.abs(index - selectedIndex);

      if (diff === 0) {
        return;
      }
      listScrollRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true,
      });
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (originSelectedIndex !== undefined && originSelectedIndex !== selectedIndex) {
      setSelectedIndex(originSelectedIndex);
      changeTabWithAnimation(originSelectedIndex);
    }
  }, [changeTabWithAnimation, originSelectedIndex, selectedIndex]);

  const handlePressTab = useCallback(
    (index: number, id: string) => {
      changeTabWithAnimation(index);
      onSelect?.(index, id);
      setSelectedIndex(index);
    },
    [changeTabWithAnimation, onSelect]
  );

  const handleChangeIndex = useCallback(
    (index: number) => {
      handlePressTab(index, items[index].id);
    },
    [handlePressTab, items]
  );

  const keyExtractor = useCallback((item: TabItemType) => item.id, []);

  const handleLayoutHeader = useCallback((e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  }, []);

  return (
    <View className={cn("flex-1", className)}>
      <Animated.View style={headerAnimatedStyle}>
        <TabHeader
          items={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          listScrollRef={listScrollRef}
          wrapperClassName={headerClassName}
          enableHeaderScroll={enableHeaderScroll}
          showUnderline={showUnderline}
          underlineClassName={underlineClassName}
          selectedIndex={selectedIndex}
          onPressTab={handlePressTab}
          onLayout={handleLayoutHeader}
        />
      </Animated.View>
      <Animated.View style={bodyAnimatedStyle}>
        <TabBody
          wrapperClassName={bodyClassName}
          items={items}
          selectedIndex={selectedIndex}
          onChangeIndex={handleChangeIndex}
          skipIntermediateTabs={skipIntermediateTabs}
          enableTabTransitionAnimation={enableTabTransitionAnimation}
        />
      </Animated.View>
    </View>
  );
}
