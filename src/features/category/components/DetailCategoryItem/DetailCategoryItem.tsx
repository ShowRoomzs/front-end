import { useCallback } from "react";
import { Pressable } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Category } from "@/features/category/types/category";

interface DetailCategoryItemProps {
  item: Category;
  onPress: (categoryId: number) => void;
}
export default function DetailCategoryItem(props: DetailCategoryItemProps) {
  const { item, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(item.categoryId);
  }, [onPress, item.categoryId]);

  return (
    <Pressable onPress={handlePress} className="h-51 flex justify-center border-b-[1px] border-gray1">
      <HStack className="justify-between items-center">
        <Typography className="text-13 text-gray15 font-medium">{item.name}</Typography>
        <Icon width={15} height={15} icon={COMMON_ASSETS.arrowRight} />
      </HStack>
    </Pressable>
  );
}
