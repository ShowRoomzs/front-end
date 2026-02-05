import { View } from "react-native";

import VStack from "@/common/components/VStack/VStack";
import DetailCategoryItem from "@/features/category/components/DetailCategoryItem/DetailCategoryItem";
import SubCategoryItem from "@/features/category/components/SubCategoryList/SubCategoryItem";
import { SubCategory } from "@/features/category/components/SubCategoryList/SubCategoryList";

interface SubCategoryWrapperProps {
  item: SubCategory;
  onPress: (categoryId: number) => void;
}
export default function SubCategoryWrapper(props: SubCategoryWrapperProps) {
  const { item, onPress } = props;

  return (
    <VStack gap={10} className="flex-1 pt-20 px-15">
      <SubCategoryItem item={item} onPress={onPress} />
      <View className="flex-row flex-wrap">
        {item.children.map((child, ix) => {
          return (
            <View
              key={child.categoryId}
              style={{ paddingRight: ix % 2 === 0 ? 10 : 0 }}
              className="w-1/2 mb-10"
            >
              <DetailCategoryItem item={child} onPress={onPress} />
            </View>
          );
        })}
      </View>
    </VStack>
  );
}
