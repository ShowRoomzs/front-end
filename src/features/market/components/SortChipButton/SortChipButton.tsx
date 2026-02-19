import { View } from "react-native";

import ChipButton from "@/common/components/ChipButton/ChipButton";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface SortChipButtonProps {
  label: string;
  onPress: () => void;
  wrapperClassName?: string;
}
export default function SortChipButton(props: SortChipButtonProps) {
  const { label, onPress, wrapperClassName } = props;

  return (
    <ChipButton
      label={
        <View className="flex flex-row items-center">
          <Typography className="text-12 text-gray14 font-normal">{label}</Typography>
          <Icon icon={COMMON_ASSETS.arrowDown} />
        </View>
      }
      onPress={onPress}
      wrapperClassName={wrapperClassName}
    />
  );
}
