import { useCallback } from "react";
import { FlatList, View } from "react-native";

import SubCategoryWrapper from "@/features/category/components/SubCategoryList/SubCategoryWrapper";
import { Category } from "@/features/category/types/category";

export interface SubCategory extends Category {
  children: Array<Category>;
}

interface SubCategoryListProps {
  className?: string;
  items: Array<SubCategory>;
  onPress: (categoryId: number) => void;
}

export default function SubCategoryList(props: SubCategoryListProps) {
  const { items, onPress, className } = props;
  const renderItem = useCallback(
    ({ item }: { item: SubCategory }) => {
      return <SubCategoryWrapper item={item} onPress={onPress} />;
    },
    [onPress]
  );

  return (
    <FlatList
      ItemSeparatorComponent={() => <View className="h-10" />}
      className={className ? className : ""}
      data={items}
      renderItem={renderItem}
    />
  );
}
