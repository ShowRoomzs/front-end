import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";

import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useTabs } from "@/common/hooks/useTabs";
import { CATEGORY_ROUTES, useCategoryNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CategoryStackParamList } from "@/common/router/types";
import CategoryDetailContent from "@/features/category/components/CategoryDetailContent/CategoryDetailContent";
import CategoryDetailHeader from "@/features/category/components/CategoryDetailHeader/CategoryDetailHeader";
import { useCategory } from "@/features/category/hooks/useCategory";

export default function CategoryDetailView() {
  const route = useRoute<RouteProp<CategoryStackParamList, typeof CATEGORY_ROUTES.DETAIL>>();
  const navigation = useCategoryNavigation();
  const rootNavigation = useMainNavigation();
  const { show: showBottomTab } = useBottomTab();
  const { show: showTabs } = useTabs();
  const { categoryId } = route.params;
  const { categoryMap } = useCategory();
  // 2뎁스 카테고리 추출
  const category = useMemo(() => categoryMap?.getSubCategory(categoryId), [categoryMap, categoryId]);
  // 3뎁스 카테고리 추출
  const detailCategories = useMemo(
    () => (category?.categoryId ? categoryMap?.getChildCategories(category?.categoryId) : []),
    [categoryMap, category]
  );

  const initialIndex = useMemo(() => {
    const index = detailCategories?.findIndex(c => c.categoryId === categoryId);

    return index !== undefined && index > -1 ? index + 1 : 0;
  }, [categoryId, detailCategories]);

  const { selectedTabIndex, updateTabIndex } = useTabIndex(initialIndex);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    rootNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [rootNavigation]);

  const handlePressSearch = useCallback(() => {
    rootNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [rootNavigation]);

  const tabItems = useMemo(() => {
    if (!detailCategories?.length || !category?.categoryId) {
      return [];
    }

    const items: Array<TabItemType> = [
      {
        id: "all",
        label: "전체",
        render: () => <CategoryDetailContent categoryId={category?.categoryId} />,
      },
    ];

    items.push(
      ...detailCategories.map(category => ({
        id: category.categoryId.toString(),
        label: category.name,
        render: () => <CategoryDetailContent categoryId={category.categoryId} />,
      }))
    );
    return items;
  }, [category?.categoryId, detailCategories]);

  // 카테고리 detail 페이지 나가면 하단 탭바와 탭 헤더 보이기
  useEffect(() => {
    return () => {
      showBottomTab();
      showTabs();
    };
  }, [showBottomTab, showTabs]);

  if (!category) {
    return null;
  }

  return (
    <VStack className="flex-1">
      <View className="z-10 relative">
        <CategoryDetailHeader
          subCategory={category}
          onPressBack={handlePressBack}
          onPressCart={handlePressCart}
          onPressSearch={handlePressSearch}
        />
      </View>
      <View className="flex-1">
        <Tabs
          selectedIndex={selectedTabIndex}
          onSelect={updateTabIndex}
          headerClassName="h-47 border-b border-gray2"
          bodyClassName="flex-1"
          items={tabItems}
          skipIntermediateTabs
        />
      </View>
    </VStack>
  );
}
