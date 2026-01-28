import { useMemo } from "react";
import { View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Stepper from "@/common/components/Stepper/Stepper";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { LocalVariant } from "@/features/product/components/ProductOptionBottomSheet/ProductOptionBottomSheet";
import {
  VARIANT_CARD_MAX_COUNT,
  VARIANT_CARD_MIN_COUNT,
} from "@/features/product/components/VariantCard/config";

interface VariantCardProps {
  variant: LocalVariant;
  onRemove: () => void;
  onChangeCount: (count: number) => void;
}
export default function VariantCard(props: VariantCardProps) {
  const { variant, onRemove, onChangeCount } = props;

  const totalPrice = useMemo(() => variant.salePrice * variant.count, [variant.salePrice, variant.count]);

  return (
    <VStack className="bg-gray0 border-[1px] border-gray2 p-15" gap={10}>
      <View className="flex flex-row justify-between">
        <Typography className="max-w-[80%] text-13 text-black font-medium whitespace-pre-wrap ">
          {variant.name}
        </Typography>
        <Icon onPress={onRemove} icon={COMMON_ASSETS.closeBlack} />
      </View>
      <View className="flex flex-row items-center justify-between">
        <Stepper
          min={VARIANT_CARD_MIN_COUNT}
          max={VARIANT_CARD_MAX_COUNT}
          value={variant.count}
          onChange={onChangeCount}
        />
        <Typography className="text-black text-15 font-medium">₩ {totalPrice.toLocaleString()}</Typography>
      </View>
    </VStack>
  );
}
