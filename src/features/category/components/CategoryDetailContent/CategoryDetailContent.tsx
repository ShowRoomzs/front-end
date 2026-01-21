import { View } from "react-native";

import { Category } from "@/features/auth/types/category";

interface CategoryDetailContentProps {
  category: Category | "all" | undefined;
}
export default function CategoryDetailContent(props: CategoryDetailContentProps) {
  const { category } = props;

  if (!category) {
    return null;
  }
  console.log("category", category);

  return <View>{/* <Text>{category}</Text> */}</View>;
}
