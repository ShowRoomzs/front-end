import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { categoryService } from "@/features/auth/services/categoryService";
import { Category } from "@/features/auth/types/category";

export interface CategoryMap {
  byId: Map<number, Category>;
  byParentId: Map<number, Array<Category>>;
  mainCategories: Array<Category>;
}

export function useGetCategory() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });
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

    return {
      byId,
      byParentId,
      mainCategories,
    };
  }, [query.data]);

  return {
    ...query,
    categoryMap,
  };
}
