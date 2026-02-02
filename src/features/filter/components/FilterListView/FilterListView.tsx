import { useCallback } from "react";
import { FlatList, View } from "react-native";

import ChipButton from "@/common/components/ChipButton/ChipButton";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import { Filter } from "@/features/filter/types/filter";

interface FilterListViewProps {
  filters: Array<Filter>;
  onPressFilter: (filterId: number) => void;
  wrapperClassName?: string;
}
export default function FilterListView(props: FilterListViewProps) {
  const { filters, onPressFilter, wrapperClassName } = props;

  const renderItem = useCallback(
    ({ item }: { item: Filter }) => {
      return (
        <ChipButton
          label={
            <HStack className="items-center">
              <Typography className="text-12 text-gray14 font-normal">{item.label}</Typography>
              <Icon icon={COMMON_ASSETS.arrowDown} />
            </HStack>
          }
          onPress={() => onPressFilter(item.id)}
          key={item.id}
        />
      );
    },
    [onPressFilter]
  );

  return (
    <View className={cn("w-full py-6 px-10", wrapperClassName)}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-10" />}
        horizontal
        data={filters}
        renderItem={renderItem}
      />
    </View>
  );
}
