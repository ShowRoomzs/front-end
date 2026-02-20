import { useCallback } from "react";
import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function ProductDetailInquiry() {
  const handlePressInquiry = useCallback(() => {
    // TODO : navigate to 1:1문의
  }, []);

  const handlePressProductInquiry = useCallback(() => {
    // TODO : navigate to product inquiry
  }, []);

  return (
    <View className="flex flex-col">
      <View className="mt-25 flex flex-col items-center">
        <Icon icon={COMMON_ASSETS.gift} />
        <Typography className="mt-20 text-black text-16 font-semibold">
          상품에 대해 궁금하신 것이 있으신가요?
        </Typography>
        <Typography className="mt-10 text-gray9 text-13 font-normal">
          상품 관련 문의는
          <Typography className="mt-10 text-gray11 text-13 font-normal">판매자가 상세히 답변</Typography>
          드립니다.
        </Typography>
        <Typography className="mt-4 text-gray9 text-13 font-normal">
          답변은
          <Typography
            onPress={handlePressInquiry}
            className="mt-10 text-gray11 text-13 font-normal underline"
          >
            {"마이페이지 > 1:1문의"}
          </Typography>
          에서 확인하실 수 있습니다.
        </Typography>
        <View className="mt-25">
          <Button onPress={handlePressProductInquiry} size="lg" className="px-72" variant="primary">
            상품 문의하기
          </Button>
        </View>
      </View>
    </View>
  );
}
