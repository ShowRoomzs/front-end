import { useCallback, useEffect, useMemo, useState } from "react";

import HStack from "@/common/components/HStack/HStack";
import VStack from "@/common/components/VStack/VStack";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useGetCategory } from "@/features/auth/hooks/useGetCategory";
import CategoryHeader from "@/features/category/components/CategoryHeader/CategoryHeader";
import CategorySidebar from "@/features/category/components/CategorySidebar/CategorySidebar";
import SubCategoryList, { SubCategory } from "@/features/category/components/SubCategoryList/SubCategoryList";

export default function CategoryView() {
  const { categoryMap } = useGetCategory();
  const navigation = useMainNavigation();
  const [mainCategory, setMainCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!categoryMap || mainCategory) {
      return;
    }
    const initialCategory = categoryMap.mainCategories[0];

    if (!initialCategory) {
      return;
    }
    setMainCategory(initialCategory.categoryId);
  }, [categoryMap, mainCategory]);

  const handleChangeMainCategory = useCallback((categoryId: number) => {
    setMainCategory(categoryId);
  }, []);

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

  const subCategories: Array<SubCategory> = useMemo(() => {
    if (!mainCategory || !categoryMap) {
      return [];
    }

    const secondLevelCategories = categoryMap.byParentId.get(mainCategory) || [];

    return secondLevelCategories.map(category => ({
      ...category,
      children: categoryMap.byParentId.get(category.categoryId) || [],
    }));
  }, [mainCategory, categoryMap]);

  const handlePressSubCategory = useCallback((categoryId: number) => {
    void categoryId;
  }, []);

  return (
    <VStack className="flex-1">
      <CategoryHeader onPressCart={handlePressCart} onPressSearch={handlePressSearch} />
      <HStack className="flex-1">
        <CategorySidebar
          categories={categoryMap?.mainCategories || []}
          selectedCategoryId={mainCategory}
          onChangeSelectedCategoryId={handleChangeMainCategory}
        />
        <SubCategoryList className="flex-1" items={subCategories} onPress={handlePressSubCategory} />
      </HStack>
    </VStack>
  );
}
