import { useCallback } from "react";
import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { BENEFITS } from "@/features/product/components/BenefitBottomSheet/config";

interface BenefitBottomSheetProps {
  sheetApi?: SheetApi;
}
export default function BenefitBottomSheet(props: BenefitBottomSheetProps) {
  const { sheetApi } = props;

  const handlePressClose = useCallback(() => {
    sheetApi?.close();
  }, [sheetApi]);

  return (
    <View className="flex-1">
      <View className="absolute right-15">
        <Icon onPress={handlePressClose} icon={COMMON_ASSETS.closeBlack} />
      </View>
      <View className="flex items-center w-full mt-15">
        <Typography className="text-black text-18 font-semibold">최대혜택가 안내</Typography>
      </View>
      <VStack gap={10} className="mt-20 p-20 bg-gray0">
        {BENEFITS.map(benefit => (
          <HStack key={benefit} gap={10} className="items-center">
            <View className="w-4 h-4 bg-gray7 rounded-full" />
            <Typography className="text-gray11 text-13 font-normal">{benefit}</Typography>
          </HStack>
        ))}
      </VStack>
      <View className="p-10">
        <Button size="xl" variant="primary" onPress={handlePressClose}>
          확인
        </Button>
      </View>
    </View>
  );
}
