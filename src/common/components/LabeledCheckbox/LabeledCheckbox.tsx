import { ReactNode } from "react";
import { Pressable, View } from "react-native";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import HStack from "@/common/components/HStack/HStack";
import { cn } from "@/common/utils/cn";

interface LabeledCheckboxProps {
  isChecked: boolean;
  onChange: (newChecked: boolean) => void;
  label: ReactNode;
  onPressLabel?: () => void;
  wrapperClassName?: string;
  renderRight?: ReactNode;
}

export default function LabeledCheckbox(props: LabeledCheckboxProps) {
  const { isChecked, onChange, label, onPressLabel, wrapperClassName, renderRight } = props;

  const handlePressLabel = () => {
    if (onPressLabel) {
      onPressLabel();
    } else {
      onChange(!isChecked);
    }
  };

  return (
    <View className={cn("flex flex-row justify-between items-center", wrapperClassName)}>
      <HStack className="flex-1 items-center" gap={10}>
        <Checkbox isChecked={isChecked} onChange={onChange} />
        <Pressable onPress={handlePressLabel}>
          <HStack gap={6} className="items-center">
            {label}
          </HStack>
        </Pressable>
      </HStack>
      {renderRight && <View>{renderRight}</View>}
    </View>
  );
}
