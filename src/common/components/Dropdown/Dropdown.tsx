import { useState } from "react";
import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}
interface DropdownProps {
  items: Array<DropdownItem>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export default function Dropdown(props: DropdownProps) {
  const { items, value, onChange, placeholder } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (item: DropdownItem) => {
    onChange(item.value);
    setIsOpen(false);
  };

  const selectedItem = items.find(item => item.value === value);

  return (
    <Pressable
      onPress={handlePress}
      className={cn("flex flex-col border-[1px] border-gray3 rounded-[5px]", isOpen && "border-gray13")}
    >
      <View className="flex flex-row items-center justify-between p-15">
        <Typography className={cn("text-14 text-gray10 font-normal", selectedItem && "text-black")}>
          {selectedItem?.label || placeholder || "선택"}
        </Typography>
        <Icon icon={COMMON_ASSETS.arrowDown} />
      </View>
      {isOpen && (
        <VStack>
          {items.map(item => {
            const isSelected = value === item.value;

            return (
              <Pressable
                onPress={() => handleChange(item)}
                key={item.value}
                className="flex flex-row items-center justify-between p-15 border-t-[1px] border-gray2"
              >
                <Typography className="text-13 text-black font-normal">{item.label}</Typography>
                {isSelected && <Icon icon={COMMON_ASSETS.check} />}
              </Pressable>
            );
          })}
        </VStack>
      )}
    </Pressable>
  );
}
