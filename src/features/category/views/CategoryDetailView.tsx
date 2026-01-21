import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ListRenderItemInfo, View } from "react-native";

import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { CATEGORY_ROUTES, useCategoryNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CategoryStackParamList } from "@/common/router/types";
import { cn } from "@/common/utils/cn";
import { useGetCategory } from "@/features/auth/hooks/useGetCategory";
import CategoryDetailContent from "@/features/category/components/CategoryDetailContent/CategoryDetailContent";
import CategoryDetailHeader from "@/features/category/components/CategoryDetailHeader/CategoryDetailHeader";

export default function CategoryDetailView() {
  const route = useRoute<RouteProp<CategoryStackParamList, typeof CATEGORY_ROUTES.DETAIL>>();
  const navigation = useCategoryNavigation();
  const rootNavigation = useMainNavigation();

  const { categoryId } = route.params;
  const { categoryMap } = useGetCategory();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // 2뎁스 카테고리 추출
  const category = useMemo(() => categoryMap?.getSubCategory(categoryId), [categoryMap, categoryId]);
  const detailCategories = useMemo(
    () => (category?.categoryId ? categoryMap?.getChildCategories(category?.categoryId) : []),
    [categoryMap, category]
  );
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
    if (!detailCategories?.length) {
      return [];
    }
    const items: Array<TabItemType> = [
      {
        id: "all",
        label: "전체",
        render: () => <CategoryDetailContent category={"all"} />,
      },
    ];

    items.push(
      ...detailCategories.map(category => ({
        id: category.categoryId.toString(),
        label: category.name,
        render: () => <CategoryDetailContent category={category} />,
      }))
    );
    return items;
  }, [detailCategories]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<TabItemType>) => {
      const isActive = selectedIndex === index;

      return (
        <View className="flex-1 items-center justify-center px-15 py-15">
          <Typography className={cn("text-13 font-normal text-center", isActive && "text-black font-medium")}>
            {item.label}
          </Typography>
        </View>
      );
    },
    [selectedIndex]
  );

  const handleChangeSelectedIndex = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  if (!category) {
    return null;
  }

  return (
    <VStack className="flex-1">
      <CategoryDetailHeader
        subCategory={category}
        onPressBack={handlePressBack}
        onPressCart={handlePressCart}
        onPressSearch={handlePressSearch}
      />
      <View className="flex-1">
        <Tabs
          selectedIndex={selectedIndex}
          onSelect={handleChangeSelectedIndex}
          headerClassName="h-47"
          bodyClassName="flex-1"
          items={tabItems}
          renderItem={renderItem}
          skipIntermediateTabs
        />
      </View>
    </VStack>
  );
}
