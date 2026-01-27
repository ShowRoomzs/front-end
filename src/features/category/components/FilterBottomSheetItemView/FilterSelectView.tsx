import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Filter, FilterValue } from "@/features/category/types/category";

interface FilterSelectViewProps {
  filter: Filter;
  selectedValues: Array<string>;
  onChange: (value: string) => void;
}
export default function FilterSelectView(props: FilterSelectViewProps) {
  const { filter, onChange, selectedValues } = props;

  const handlePress = (value: FilterValue) => {
    onChange(value.value.toString());
  };

  return (
    <VStack className="h-full">
      {filter.values.map(value => {
        const isActive = selectedValues.includes(value.value);

        return (
          <Pressable
            onPress={() => handlePress(value)}
            className="py-15 flex flex-row justify-between items-center"
            key={value.id}
          >
            <Typography
              className={isActive ? "text-13 text-black font-medium" : "text-13 text-gray10 font-normal"}
            >
              {value.label}
            </Typography>
            <View style={{ width: 12, height: 12, opacity: isActive ? 1 : 0 }}>
              <Icon icon={COMMON_ASSETS.checkBlack} />
            </View>
          </Pressable>
        );
      })}
    </VStack>
  );
}
