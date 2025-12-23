import { Pressable, View } from "react-native";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface LabeledCheckboxProps {
  isChecked: boolean;
  onChange: (newChecked: boolean) => void;
  label: string;
  required?: boolean;
  onPressLabel?: () => void;
  labelClassName?: string;
  wrapperClassName?: string;
  renderRight?: React.ReactNode;
}

export default function LabeledCheckbox(props: LabeledCheckboxProps) {
  const {
    isChecked,
    onChange,
    label,
    required,
    onPressLabel,
    labelClassName,
    wrapperClassName,
    renderRight,
  } = props;

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
            <Typography className={cn("text-13", labelClassName)}>{label}</Typography>
            {required && <Typography className="text-13 text-gray9">(필수)</Typography>}
          </HStack>
        </Pressable>
      </HStack>
      {renderRight && <View>{renderRight}</View>}
    </View>
  );
}
