import { View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Stepper from "@/common/components/Stepper/Stepper";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Variant } from "@/features/product/types/product";

interface VariantCardProps {
  variant: Variant;
  onRemove: () => void;
  onChangeCount: (count: number) => void;
  count: number;
}
export default function VariantCard(props: VariantCardProps) {
  const { variant, onRemove, onChangeCount, count } = props;

  return (
    <VStack className="bg-gray0 border-[1px] border-gray2 p-15" gap={10}>
      <View className="flex flex-row justify-between">
        <Typography className="max-w-[80%] text-13 text-black font-medium whitespace-pre-wrap ">
          {variant.name}
        </Typography>
        <Icon icon={COMMON_ASSETS.closeBlack} />
      </View>
      <View className="flex flex-row justify-between">
        <Stepper value={count} onChange={onChangeCount} />
      </View>
    </VStack>
  );
}
