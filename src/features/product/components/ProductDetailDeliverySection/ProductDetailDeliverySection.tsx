import dayjs from "dayjs";
import { useMemo } from "react";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { cn } from "@/common/utils/cn";
import { DeliveryType } from "@/features/product/types/product";
import { getNextWeekday } from "@/features/product/utils/getNextWeekday";

interface ProductDetailDeliverySectionProps {
  deliveryEstimatedDays: number;
  deliveryFee: number;
  deliveryType: DeliveryType;
  containerClassName?: string;
}
export default function ProductDetailDeliverySection(props: ProductDetailDeliverySectionProps) {
  const { deliveryFee, containerClassName } = props;
  const items = useMemo(
    () => [
      {
        label: "배송 정보.",
        content: deliveryFee > 0 ? `${deliveryFee.toLocaleString()}원` : "무료 배송",
      },
      {
        label: "배송 예정 일자.",
        content: `${dayjs(getNextWeekday(new Date())).format("MM.DD(dd)")} 이내 판매자 발송 예정`,
      },
    ],
    [deliveryFee]
  );

  return (
    <VStack className={cn("px-15 py-20 border-b-[1px] border-gray2", containerClassName)} gap={20}>
      {items.map(item => (
        <View key={item.label} className="flex flex-row items-center justify-between">
          <Typography className="text-13 text-gray9 font-normal">{item.label}</Typography>
          <Typography className="text-13 text-black font-normal">{item.content}</Typography>
        </View>
      ))}
    </VStack>
  );
}
