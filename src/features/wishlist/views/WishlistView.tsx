import { useCallback, useMemo } from "react";
import { ListRenderItemInfo, Text, View } from "react-native";

import StretchTabHeaderItem from "@/common/components/Tabs/StretchTabHeaderItem";
import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import { useParams } from "@/common/hooks/useParams";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import WishlistHeader from "@/features/wishlist/components/WishlistHeader/WishlistHeader";
import WishlistProduct from "@/features/wishlist/components/WishlistProduct/WishlistProduct";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";
import { WishlistParams } from "@/features/wishlist/types/params";

const INITIAL_PARAMS: WishlistParams = {
  page: 1,
  limit: 10,
  categoryId: null,
};

export default function WishlistView() {
  const { params } = useParams<WishlistParams>(INITIAL_PARAMS);
  const { products } = useGetWishlist(params);
  const { selectedTabIndex, updateTabIndex } = useTabIndex();
  const navigation = useMainNavigation();

  const tabItems: Array<TabItemType> = useMemo(
    () => [
      {
        id: "product",
        label: "상품",
        render: () => <WishlistProduct />,
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
    []
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

  return (
    <View className="flex-1">
      <WishlistHeader
        wrapperClassName="px-20"
        likeCount={products.length}
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
