import { useCallback, useEffect, useMemo, useState } from "react";

import HStack from "@/common/components/HStack/HStack";
import VStack from "@/common/components/VStack/VStack";
import { useCategoryNavigation, useMainNavigation } from "@/common/router";
import { CATEGORY_ROUTES, COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import CategoryHeader from "@/features/category/components/CategoryHeader/CategoryHeader";
import CategorySidebar from "@/features/category/components/CategorySidebar/CategorySidebar";
import SubCategoryList, { SubCategory } from "@/features/category/components/SubCategoryList/SubCategoryList";
import { useCategory } from "@/features/category/hooks/useCategory";

export default function CategoryView() {
  const { categoryMap } = useCategory();
  const mainNavigation = useMainNavigation();
  const categoryNavigation = useCategoryNavigation();
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
    mainNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
      params: { keyword: "" },
    });
  }, [mainNavigation]);

  const handlePressCart = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [mainNavigation]);

  // 선택한 main category 하위 뎁스만 표출 되도록
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

  const handlePressSubCategory = useCallback(
    (categoryId: number) => {
      categoryNavigation.navigate(CATEGORY_ROUTES.DETAIL, { categoryId });
    },
    [categoryNavigation]
  );

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
