import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { View } from "react-native";

import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { toast } from "@/common/providers/ToastProvider";
import { useCouponNavigation } from "@/common/router";
import { CustomErrorResponse } from "@/common/types/error";
import CouponRegisterActions from "@/features/coupon/components/CouponRegisterActions/CouponRegisterActions";
import CouponRegisterHeader from "@/features/coupon/components/CouponRegisterHeader/CouponRegisterHeader";
import { WARN_ITEMS } from "@/features/coupon/constants/config";
import { useCreateCouponMutation } from "@/features/coupon/hooks/useCreateCouponMutation";

export default function CouponRegisterView() {
  const navigation = useCouponNavigation();
  const [code, setCode] = useState("");
  const { mutateAsync: createCoupon } = useCreateCouponMutation();
  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressRegister = useCallback(async () => {
    try {
      await createCoupon({ code });
      toast.show("쿠폰이 등록되었습니다.");
      setCode("");
      navigation.goBack();
    } catch (error) {
      const err = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

      toast.error(err.response?.data.message || "쿠폰 등록에 실패했습니다.");
    }
  }, [code, createCoupon, navigation]);

  return (
    <View className="flex-1">
      <CouponRegisterHeader onPressBack={handlePressBack} wrapperClassName="px-20" />
      <VStack gap={30} className="px-20 pt-25">
        <LabeledInput
          label="쿠폰 코드"
          placeholder="쿠폰 코드를 입력해 주세요."
          value={code}
          onChangeText={setCode}
        />
        <LabeledComponent label="주의사항">
          <VStack className="p-15 bg-gray0 border-gray2 border rounded-[5px]" gap={15}>
            {WARN_ITEMS.map(item => (
              <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                <Typography className="text-11 text-gray12 font-normal">•</Typography>
                <Typography className="text-11 text-gray12 font-normal" style={{ flex: 1 }}>
                  {item}
                </Typography>
              </View>
            ))}
          </VStack>
        </LabeledComponent>
      </VStack>
      <CouponRegisterActions disabled={!code} onPress={handlePressRegister} />
    </View>
  );
}
