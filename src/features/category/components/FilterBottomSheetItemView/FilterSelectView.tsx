import { Pressable } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { Filter, FilterValue } from "@/features/category/types/category";

interface FilterSelectViewProps {
  filter: Filter;
  onChange: (value: number) => void;
}
export default function FilterSelectView(props: FilterSelectViewProps) {
  const { filter, onChange } = props;

  const handlePress = (value: FilterValue) => {
    onChange(value.id);
  };

  // TODO : active 상태 ui 분기처리

  return (
    <VStack className="h-full">
      {filter.values.map(value => (
        <Pressable onPress={() => handlePress(value)} className="py-15" key={value.id}>
          <Typography className="text-13 text-gray10 font-normal">{value.label}</Typography>
        </Pressable>
      ))}
    </VStack>
  );
}
