import { View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import BenefitBottomSheet from "@/features/product/components/BenefitBottomSheet/BenefitBottomSheet";
import { BENEFIT_BOTTOM_SHEET_SNAP_POINTS } from "@/features/product/components/BenefitBottomSheet/config";

interface ProductDetailBenefitSectionProps {
  //   benefits: Array<string>; // TODO : 추후 타입 정의
  benefitPrice: number;
  containerClassName?: string;
}
export default function ProductDetailBenefitSection(props: ProductDetailBenefitSectionProps) {
  const { benefitPrice, containerClassName } = props;
  const { open } = useBottomSheet({
    id: "benefit-bottom-sheet",
    render: <BenefitBottomSheet />,
    sheetProps: {
      snapPoints: [BENEFIT_BOTTOM_SHEET_SNAP_POINTS],
      handleIndicatorStyle: { display: "none" },
    },
  });

  return (
    <View className={cn("px-20", containerClassName)}>
      <View className="border-[1px] border-gray1 rounded-[5px] p-15">
        <View className="flex flex-row justify-between">
          <HStack className="items-center" gap={6}>
            <Typography className="text-14 text-gray11 font-normal">최대 혜택가.</Typography>
            <Icon onPress={open} icon={COMMON_ASSETS.infoIcon} />
          </HStack>
          <Typography className="text-16 text-pointColor font-medium">
            ₩ {benefitPrice.toLocaleString()}
          </Typography>
        </View>
        {/* benefits */}
        <VStack gap={8} className="p-10 bg-gray0 rounded-[5px] mt-15">
          <View className="flex flex-row items-center justify-between">
            <Typography className="text-12 text-gray10 font-normal">- 등급 정립.</Typography>
            <Typography className="text-12 text-black font-normal">300 포인트</Typography>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Typography className="text-12 text-gray10 font-normal">- 등급 정립.</Typography>
            <Typography className="text-12 text-black font-normal">300 포인트</Typography>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Typography className="text-12 text-gray10 font-normal">- 등급 정립.</Typography>
            <Typography className="text-12 text-black font-normal">300 포인트</Typography>
          </View>
        </VStack>
      </View>
    </View>
  );
}
