import { Pressable } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface CheckboxProps {
  isChecked: boolean;
  onChange: (newChecked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  const { isChecked = false, onChange } = props;
  const getDefaultClassName = () => {
    return "w-24 h-24 border-[1px] flex items-center justify-center";
  };

  const getClassNameByIsChecked = () => {
    if (isChecked) {
      return "bg-gray13 border-gray15";
    }
    return "bg-gray1 border-gray3";
  };

  const handlePress = () => {
    onChange(!isChecked);
  };

  return (
    <Pressable onPress={handlePress} className={cn(getDefaultClassName(), getClassNameByIsChecked())}>
      {isChecked && <Icon icon={COMMON_ASSETS.check} />}
    </Pressable>
  );
}
