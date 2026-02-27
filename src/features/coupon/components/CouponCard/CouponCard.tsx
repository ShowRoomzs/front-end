import dayjs from "dayjs";
import { useMemo } from "react";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { getDisplayPrice } from "@/common/utils/getPriceUnit";
import { Coupon } from "@/features/coupon/types/coupon";

interface CouponCardProps {
  coupon: Coupon;
}
export default function CouponCard(props: CouponCardProps) {
  const { coupon } = props;

  const priceLabel = useMemo(() => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }
    return `₩ ${coupon.discountValue}`;
  }, [coupon.discountType, coupon.discountValue]);

  const chipLabel = useMemo(() => {
    const labels: Array<string> = [];

    if (coupon.minOrderAmount) {
      labels.push(`${getDisplayPrice(coupon.minOrderAmount)}원 이상 결제 시`);
    }
    if (coupon.maxDiscountAmount) {
      labels.push(`최대 ${getDisplayPrice(coupon.maxDiscountAmount)}원`);
    }

    if (!labels.length) {
      return "제한 없음";
    }

    return labels.join(", ");
  }, [coupon.maxDiscountAmount, coupon.minOrderAmount]);

  return (
    <VStack className="p-20 border-[1px] border-gray2 rounded-[5px] bg-white" gap={10}>
      <VStack gap={6}>
        <Typography className="text-black text-20 font-semibold">{priceLabel}</Typography>
        <Typography className="text-gray15 text-14 font-medium">{coupon.name}</Typography>
        <Typography className="text-gray10 text-13 font-normal">{`${dayjs(coupon.validStartAt).format("YYYY.MM.DD")} ~ ${dayjs(coupon.validEndAt).format("YYYY.MM.DD")}`}</Typography>
      </VStack>
      <View className="flex flex-row justify-between">
        <View className="px-10 py-6 flex items-center justify-center bg-gray1 rounded-[30px]">
          <Typography className="text-gray10 text-11 font-normal">{chipLabel}</Typography>
        </View>
        {/* TODO : 언제 표시되어야 하는지? */}
        <Typography className="text-gray9 text-11 font-normal self-end">일부 상품 제외</Typography>
      </View>
    </VStack>
  );
}
