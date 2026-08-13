import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { useGetProductByCoupons } from "@/features/coupon/hooks/useGetProductByCoupons";

interface CouponDownloadBottomSheetProps {
  sheetApi?: SheetApi;
  productId: number;
}
export default function CouponDownloadBottomSheet(props: CouponDownloadBottomSheetProps) {
  const { productId } = props;
  const { data: _productByCoupons } = useGetProductByCoupons(productId);

  // TODO : 쿠폰 리스트 표출 및 쿠폰 다운로드 api 연동
  return (
    <View className="flex-1">
      <View className="flex items-center w-full mt-15">
        <Typography className="text-black text-18 font-semibold">쿠폰 받기</Typography>
      </View>
      <VStack className="mt-20 flex-1 p-20 bg-gray0" gap={10}></VStack>
    </View>
  );
}
