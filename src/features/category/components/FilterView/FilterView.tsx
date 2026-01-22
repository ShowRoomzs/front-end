import { useCallback } from "react";
import { FlatList, View } from "react-native";

import ChipButton from "@/common/components/ChipButton/ChipButton";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Filter } from "@/features/category/types/category";

interface FilterViewProps {
  filters: Array<Filter>;
}
export default function FilterView(props: FilterViewProps) {
  const { filters } = props;

  const renderItem = useCallback(({ item }: { item: Filter }) => {
    return (
      <ChipButton
        label={
          <HStack className="items-center">
            <Typography className="text-12 text-gray14 font-normal">{item.label}</Typography>
            <Icon icon={COMMON_ASSETS.arrowDown} />
          </HStack>
        }
        onPress={() => {}}
        key={item.id}
      />
    );
  }, []);

  return (
    <View className="w-full py-6 px-10 border bg-gray0">
      <FlatList
        ItemSeparatorComponent={() => <View className="w-10" />}
        horizontal
        data={filters}
        renderItem={renderItem}
      />
    </View>
  );
}
