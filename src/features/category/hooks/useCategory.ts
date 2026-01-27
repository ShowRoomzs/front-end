import { useMemo } from "react";

import { useGetCategory } from "@/features/category/hooks/useGetCategory";
import { Category } from "@/features/category/types/category";

export interface CategoryMap {
  byId: Map<number, Category>;
  byParentId: Map<number, Array<Category>>;
  mainCategories: Array<Category>;
  getSubCategory: (categoryId: number) => Category | null;
  getChildCategories: (categoryId: number) => Array<Category>;
}

export function useCategory() {
  const query = useGetCategory();

  const categoryMap = useMemo<CategoryMap | null>(() => {
    if (!query.data) {
      return null;
    }

    const byId = new Map<number, Category>();
    const byParentId = new Map<number, Array<Category>>();
    const mainCategories: Category[] = [];

    query.data.forEach(category => {
      byId.set(category.categoryId, category);

      if (!category.parentId) {
        mainCategories.push(category);
      } else {
        const parentCategories = byParentId.get(category.parentId) || [];

        parentCategories.push(category);
        byParentId.set(category.parentId, parentCategories);
      }
    });

    mainCategories.sort((a, b) => a.order - b.order);

    byParentId.forEach(categories => {
      categories.sort((a, b) => a.order - b.order);
    });

    // 2뎁스 카테고리만 반환 (3뎁스 → 2뎁스, 2뎁스 → 2뎁스)
    const getSubCategory = (categoryId: number): Category | null => {
      const category = byId.get(categoryId);

      if (!category || !category.parentId) {
        return null;
      }

      const parent = byId.get(category.parentId);

      if (!parent) {
        return null;
      }

      // 부모의 parentId가 null이면 현재 카테고리가 2depth
      if (!parent.parentId) {
        return category;
      }

      // 부모의 parentId가 있으면 현재는 3depth, 부모가 2depth
      return parent;
    };

    const getChildCategories = (categoryId: number): Array<Category> => {
      return query.data.filter(category => category.parentId === categoryId);
    };

    return {
      byId,
      byParentId,
      mainCategories,
      getSubCategory,
      getChildCategories,
    };
  }, [query.data]);

  return { categoryMap };
}
