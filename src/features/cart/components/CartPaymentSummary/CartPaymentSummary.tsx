import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import PriceRow from "@/features/cart/components/CartPaymentSummary/PriceRow";

interface PriceAdjustment {
  label: string;
  value: number;
}
interface CartPaymentSummaryProps {
  totalPrice: number;
  priceAdjustments: Array<PriceAdjustment>;
  expectedRewardPoints?: number;
}
export default function CartPaymentSummary(props: CartPaymentSummaryProps) {
  const { priceAdjustments, totalPrice, expectedRewardPoints } = props;

  return (
    <VStack className="mt-25 px-20" gap={15}>
      <Typography className="text-black text-16 font-semibold">예상 결제 금액</Typography>
      <VStack gap={15} className="px-15 py-20 border-[1px] border-gray2">
        <VStack gap={10}>
          <PriceRow label="총 상품 가격" value={totalPrice.toLocaleString()} />
          {priceAdjustments.map(item => (
            <PriceRow
              key={item.label}
              label={item.label}
              value={item.value.toLocaleString()}
              valueClassName="text-13 font-normal"
              valueStyle={{ color: item.value > 0 ? "rgba(141, 141, 145, 1)" : "rgba(240, 49, 103, 1)" }}
            />
          ))}
        </VStack>
        <View className="w-full h-[1px] bg-gray2" />
        <VStack gap={10}>
          <PriceRow
            label="총 결제 예상 금액"
            value={`₩ ${totalPrice.toLocaleString()}`}
            valueClassName="text-18 font-semibold text-black"
          />
          {expectedRewardPoints && expectedRewardPoints > 0 && (
            <PriceRow
              label="예상 적립금"
              value={expectedRewardPoints.toLocaleString()}
              valueClassName="text-16 font-medium text-black"
            />
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
