import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}
export default function Stepper(props: StepperProps) {
  const { value, onChange, min = 0, max = Infinity } = props;

  const handlePressDecrease = () => {
    if (value <= min) {
      return;
    }
    onChange(value - 1);
  };
  const handlePressIncrease = () => {
    if (value >= max) {
      return;
    }
    onChange(value + 1);
  };

  const isDisabledDecrease = value <= min;
  const isDisabledIncrease = value >= max;

  return (
    <View className="flex flex-row items-center bg-white">
      <Pressable
        onPress={handlePressDecrease}
        className={cn(
          "flex items-center justify-center px-15 h-36 border-[1px] border-gray4",
          isDisabledDecrease && "bg-gray2"
        )}
      >
        <Icon icon={COMMON_ASSETS.minusIcon} stroke={isDisabledDecrease ? "#A8A8AD" : "#0D0C11"} />
      </Pressable>
      <View className="flex items-center justify-center border-y-[1px] border-gray4 w-60 h-36">
        <Typography className="text-13 text-black font-medium">{value}</Typography>
      </View>
      <Pressable
        onPress={handlePressIncrease}
        className={cn(
          "flex items-center justify-center px-15 h-36 border-[1px] border-gray4",
          isDisabledIncrease && "bg-gray2"
        )}
      >
        <Icon icon={COMMON_ASSETS.plusIcon} stroke={isDisabledIncrease ? "#A8A8AD" : "#0D0C11"} />
      </Pressable>
    </View>
  );
}
