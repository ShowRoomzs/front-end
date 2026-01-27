import { useCallback } from "react";
import { FlatList } from "react-native";

import CategorySidebarItem from "@/features/category/components/CategorySidebar/CategorySidebarItem";
import { Category } from "@/features/category/types/category";

interface CategorySidebarProps {
  categories: Array<Category>;
  selectedCategoryId: number | null;
  onChangeSelectedCategoryId: (categoryId: number) => void;
}
export default function CategorySidebar(props: CategorySidebarProps) {
  const { categories, onChangeSelectedCategoryId, selectedCategoryId } = props;

  const renderItem = useCallback(
    ({ item }: { item: Category }) => {
      const isActive = item.categoryId === selectedCategoryId;

      return (
        <CategorySidebarItem
          category={item}
          isActive={isActive}
          onPress={() => onChangeSelectedCategoryId(item.categoryId)}
        />
      );
    },
    [onChangeSelectedCategoryId, selectedCategoryId]
  );

  return <FlatList className="bg-gray0" data={categories} renderItem={renderItem} />;
}
