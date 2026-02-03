import { Pressable, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { Filter, FilterValue } from "@/features/filter/types/filter";

interface FilterColorViewProps {
  filter: Filter;
  selectedValues: Array<string>;
  onChange: (value: string) => void;
}
export default function FilterColorView(props: FilterColorViewProps) {
  const { filter, selectedValues, onChange } = props;

  const getClassNameByActive = (isActive: boolean) => {
    if (isActive) {
      return "text-13 text-black font-medium";
    }
    return "text-13 text-gray10 font-normal";
  };

  const handlePress = (value: FilterValue) => {
    onChange(value.value);
  };

  return (
    <View className="flex flex-row flex-wrap">
      {filter.values.map(value => (
        <Pressable onPress={() => handlePress(value)} key={value.id} className="w-1/2 mb-20">
          <HStack gap={10} className="items-center">
            <View className="w-24 h-24 rounded-full" style={{ backgroundColor: value.extra as string }} />
            <Typography className={getClassNameByActive(selectedValues.includes(value.value))}>
              {value.label}
            </Typography>
          </HStack>
        </Pressable>
      ))}
    </View>
  );
}
