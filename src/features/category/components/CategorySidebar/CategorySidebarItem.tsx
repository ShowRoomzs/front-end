import { Pressable, Text } from "react-native";

import { cn } from "@/common/utils/cn";
import { Category } from "@/features/category/types/category";

interface CategorySidebarItemProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

export default function CategorySidebarItem(props: CategorySidebarItemProps) {
  const { category, isActive, onPress } = props;
  const getDefaultClassName = () => {
    return "w-130 py-20 pl-15 flex justify-center";
  };
  const getClassNameByIsActive = () => {
    if (isActive) {
      return "bg-white border-l-2 border-black";
    }
    return "bg-transparent";
  };

  return (
    <Pressable onPress={onPress} className={cn(getDefaultClassName(), getClassNameByIsActive())}>
      <Text>{category.name}</Text>
    </Pressable>
  );
}
