import { Pressable } from "react-native";

import Typography from "@/common/components/Typography/Typography";
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
      {/* 앱에서 유일하게 Typography 를 안 쓰던 자리 — 여기만 시스템 글꼴로 남는다 */}
      <Typography>{category.name}</Typography>
    </Pressable>
  );
}
