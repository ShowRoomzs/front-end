import { useCallback } from "react";
import { Pressable } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { RecentSearchItem } from "@/features/search/types/recentSearch";

interface RecentSearchChipButtonProps {
  item: RecentSearchItem;
  onPress: (keyword: string) => void;
  onDelete: (id: string | number) => void;
}
export default function RecentSearchChipButton(props: RecentSearchChipButtonProps) {
  const { item, onPress, onDelete } = props;

  const handlePress = useCallback(() => {
    onPress(item.term);
  }, [item.term, onPress]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <Pressable className="px-10 py-8 rounded-[5px] border-[1px] border-gray2" onPress={handlePress}>
      <HStack gap={4} className="items-center">
        <Typography className="text-12 text-black font-normal">{item.term}</Typography>
        <Icon onPress={handleDelete} icon={COMMON_ASSETS.closeGray} />
      </HStack>
    </Pressable>
  );
}
