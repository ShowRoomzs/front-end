import { useCallback } from "react";
import { Image, Pressable, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { SubCategory } from "@/features/category/components/SubCategoryList/SubCategoryList";

interface SubCategoryItemProps {
  item: SubCategory;
  onPress: (categoryId: number) => void;
}
export default function SubCategoryItem(props: SubCategoryItemProps) {
  const { item, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(item.categoryId);
  }, [onPress, item.categoryId]);

  return (
    <Pressable className="h-30" onPress={handlePress}>
      <HStack className="flex items-center" gap={6}>
        {item.iconUrl && (
          <View className="w-30 h-30 rounded-[5px] bg-gray2 overflow-hidden flex items-center justify-center">
            <Image source={{ uri: item.iconUrl }} className="w-20 h-20 object-cover" />
          </View>
        )}
        <Typography className="text-black text-16 font-semibold">{item.name}</Typography>
      </HStack>
    </Pressable>
  );
}
