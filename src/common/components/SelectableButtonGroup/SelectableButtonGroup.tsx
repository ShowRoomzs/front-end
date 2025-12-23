import { View } from "react-native";

import Button from "../Button/Button";

import { cn } from "@/common/utils/cn";

type SelectableButtonGroupMode = "single" | "multiple";
type SelectableButtonGroupValue = string | Array<string>;

export interface SelectableButtonGroupItem {
  label: string;
  value: string;
}

interface SelectableButtonGroupProps {
  value: SelectableButtonGroupValue;
  onChange: (value: SelectableButtonGroupValue) => void;
  items: Array<SelectableButtonGroupItem>;
  mode?: SelectableButtonGroupMode;
  wrapperClassName?: string;
  numOfCols?: number;
}

export default function SelectableButtonGroup(props: SelectableButtonGroupProps) {
  const { items, onChange, value, mode = "single", wrapperClassName, numOfCols = 2 } = props;

  const getIsActive = (item: SelectableButtonGroupItem) => {
    if (mode === "single") {
      return value === item.value;
    } else {
      return value.includes(item.value);
    }
  };

  const handlePress = (item: SelectableButtonGroupItem) => {
    if (mode === "single") {
      onChange(item.value);
    } else {
      if (value.includes(item.value)) {
        const newValues = (value as Array<string>).filter(v => v !== item.value);

        onChange(newValues);
      } else {
        onChange([...value, item.value]);
      }
    }
  };

  return (
    <View className={cn("flex flex-row flex-wrap", wrapperClassName)}>
      {items.map((item, index) => {
        const isActive = getIsActive(item);
        const isLastInRow = (index + 1) % numOfCols === 0;
        const totalRows = Math.ceil(items.length / numOfCols);
        const currentRow = Math.floor(index / numOfCols);
        const isLastRow = currentRow === totalRows - 1;

        return (
          <View
            key={item.value}
            style={{
              width: `${100 / numOfCols}%`,
              paddingRight: isLastInRow ? 0 : 10,
              paddingBottom: isLastRow ? 0 : 10,
            }}
          >
            <Button onPress={() => handlePress(item)} size="lg" variant={isActive ? "outline" : "secondary"}>
              {item.label}
            </Button>
          </View>
        );
      })}
    </View>
  );
}
