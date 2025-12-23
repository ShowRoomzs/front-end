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
    <HStack gap={10} className={cn("items-center", wrapperClassName)}>
      <Checkbox isChecked={isChecked} onChange={onChange} />
      <Pressable onPress={handlePressLabel} className="flex-1">
        <HStack gap={4} className="items-center">
          <Typography className={cn("text-14", labelClassName)}>{label}</Typography>
          {required && <Typography className="text-14 text-pointColor">(필수)</Typography>}
        </HStack>
      </Pressable>
      {renderRight && <View>{renderRight}</View>}
    </HStack>
  );
}
