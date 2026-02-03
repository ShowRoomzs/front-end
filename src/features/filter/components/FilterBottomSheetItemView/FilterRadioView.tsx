import { View } from "react-native";

import Radio from "@/common/components/Radio/Radio";
import { Filter } from "@/features/filter/types/filter";

interface FilterRadioViewProps {
  filter: Filter;
  selectedValues: Array<string>;
  onChange: (value: string) => void;
}

export default function FilterRadioView(props: FilterRadioViewProps) {
  const { filter, selectedValues, onChange } = props;

  return (
    <View className="flex flex-row flex-wrap">
      {filter.values.map(value => (
        <View key={value.id} className="w-1/2 mb-20">
          <Radio
            isChecked={selectedValues.includes(value.value)}
            onChange={() => onChange(value.value)}
            label={value.label}
          />
        </View>
      ))}
    </View>
  );
}
