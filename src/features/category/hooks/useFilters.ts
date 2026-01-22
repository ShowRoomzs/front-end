import { useCategory } from "@/features/category/hooks/useCategory";
import { Filter } from "@/features/category/types/category";
import { mergeFilters } from "@/features/category/utils/mergeFilters";

/**
 * @description 특정 카테고리 id값 전달 시 해당 카테고리에 필요한 필터 리스트 반환
 */
interface UseFiltersResult {
  filters: Array<Filter>;
}
export function useFilters(categoryId: number): UseFiltersResult {
  const { categoryMap } = useCategory();

  if (!categoryMap) {
    return { filters: [] };
  }
  const { getChildCategories, getSubCategory } = categoryMap;

  const subCategory = getSubCategory(categoryId);

  if (!subCategory) {
    return { filters: [] };
  }
  const childCategories = getChildCategories(subCategory?.categoryId);

  const subCategoryFilters = subCategory.filters;
  const detailCategoryFilters = childCategories
    .filter(c => c.categoryId === categoryId || c.parentId === categoryId)
    .flatMap(c => c.filters);

  const filters = mergeFilters(subCategoryFilters, detailCategoryFilters);

  return { filters };
}
