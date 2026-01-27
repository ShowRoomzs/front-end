import { useMemo } from "react";
import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface ProductDetailPriceSectionProps {
  regularPrice: number;
  salePrice: number;
  onPressCoupon: () => void;
  containerClassName?: string;
}
export default function ProductDetailPriceSection(props: ProductDetailPriceSectionProps) {
  const { regularPrice, salePrice, onPressCoupon, containerClassName } = props;

  const discountRate = useMemo(() => {
    return Math.floor(((regularPrice - salePrice) / regularPrice) * 100);
  }, [regularPrice, salePrice]);

  const isDiscount = discountRate > 0;

  return (
    <View className={cn("px-20", containerClassName)}>
      <HStack className="justify-between">
        <VStack gap={4}>
          {isDiscount && (
            <HStack gap={4}>
              <Typography className="text-14 text-pointColor font-medium">쿠폰 할인가</Typography>
              <Typography className="text-14 text-gray9 font-normal line-through">
                ₩ {regularPrice.toLocaleString()}
              </Typography>
            </HStack>
          )}
          <HStack className="mt-4" gap={8}>
            {isDiscount && (
              <Typography className="text-22 text-pointColor font-medium">{discountRate}%</Typography>
            )}
            <Typography className="text-22 text-black font-semibold">
              ₩ {salePrice.toLocaleString()}
            </Typography>
          </HStack>
        </VStack>
        <Button
          activeOpacity={0.7}
          onPress={onPressCoupon}
          size="md"
          className="px-15 py-10 mt-auto"
          variant="primary"
        >
          <HStack gap={8.5}>
            <Icon icon={COMMON_ASSETS.downloadIcon} />
            <Typography className="text-13 text-white font-semibold">쿠폰 받기</Typography>
          </HStack>
        </Button>
      </HStack>
    </View>
  );
}
