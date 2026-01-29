import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListRenderItemInfo, Text, View } from "react-native";

import StretchTabHeaderItem from "@/common/components/Tabs/StretchTabHeaderItem";
import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CleanupFn } from "@/common/types/cleanup";
import WishlistHeader from "@/features/wishlist/components/WishlistHeader/WishlistHeader";
import WishlistProduct from "@/features/wishlist/components/WishlistProduct/WishlistProduct";
import { WishlistProductType } from "@/features/wishlist/types/wishlist";

export default function WishlistView() {
  const isFocused = useIsFocused();
  const { selectedTabIndex, updateTabIndex } = useTabIndex();
  const navigation = useMainNavigation();
  const [productCount, setProductCount] = useState<number | undefined>(undefined);
  const [cleanupFns, setCleanupFns] = useState<Array<CleanupFn>>([]);
  const prevFocusedRef = useRef(isFocused);

  const handleUpdateCallback = useCallback((fns: Array<CleanupFn>) => {
    setCleanupFns(fns);
  }, []);
  // 전체 상품 리스트가 가장 먼저 넘어옴
  const handleLoad = useCallback(
    (products: Array<WishlistProductType>) => {
      if (productCount !== undefined) {
        return;
      }
      setProductCount(products.length);
    },
    [productCount]
  );

  const tabItems: Array<TabItemType> = useMemo(
    () => [
      {
        id: "product",
        label: "상품",
        render: () => <WishlistProduct onLoad={handleLoad} onUpdateCallback={handleUpdateCallback} />,
      },
      {
        id: "contents",
        label: "콘텐츠",
        render: () => (
          <View>
            <Text>콘텐츠</Text>
          </View>
        ),
      },
    ],
    [handleLoad, handleUpdateCallback]
  );
  const renderTabHeader = useCallback(
    (item: ListRenderItemInfo<TabItemType>) => {
      return (
        <StretchTabHeaderItem
          item={item.item}
          itemCount={tabItems.length}
          isActive={item.index === selectedTabIndex}
          labelClassName="text-15 font-medium text-gray10"
          activeLabelClassName="font-semibold text-black"
        />
      );
    },
    [selectedTabIndex, tabItems.length]
  );

  const handlePressSearch = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [navigation]);

  /**
   * 현재 view 포커즈 빠지면 cleanupFns 실행
   * Tab Navigator는 탭 이동시 unmount되지 않아 뒷정리함수로 처리 불가
   */
  useEffect(() => {
    if (prevFocusedRef.current && !isFocused && cleanupFns.length) {
      cleanupFns.forEach((fn: () => void) => {
        fn();
      });
    }
    prevFocusedRef.current = isFocused;
  }, [isFocused, cleanupFns]);

  return (
    <View className="flex-1">
      <WishlistHeader
        wrapperClassName="px-20"
        likeCount={productCount}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
      <View className="flex-1">
        <Tabs
          renderItem={renderTabHeader}
          headerClassName="border-b-[1px] border-gray2"
          items={tabItems}
          scrollable
          bodyClassName="flex-1"
          enableGesture={false}
          enableHeaderScroll={false}
          enableTabTransitionAnimation={false}
          selectedIndex={selectedTabIndex}
          onSelect={updateTabIndex}
        />
      </View>
    </View>
  );
}
