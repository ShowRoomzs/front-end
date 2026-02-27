import { useCallback } from "react";
import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function CustomerCenterView() {
  const navigation = useMypageNavigation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWriteInquiry = useCallback(() => {
    navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER);
  }, [navigation]);

  return (
    <View className="flex-1 bg-white">
      <HStack className="items-center px-20 py-16 border-b border-gray-100">
        <Icon icon={COMMON_ASSETS.back} width={24} height={24} onPress={handleBack} />
        <Typography className="flex-1 text-center text-16 font-semibold mr-24">고객센터 (임시)</Typography>
      </HStack>
      <View className="flex-1 items-center justify-center px-20 gap-20">
        <Typography className="text-14 text-gray-500 text-center">
          고객센터 페이지는 아직 준비 중입니다.{"\n"}
          아래 버튼을 눌러 1:1 문의 작성 테스트를 진행하세요.
        </Typography>
        <View className="w-full">
          <Button size="xl" variant="primary" onPress={handleWriteInquiry}>
            1:1 문의 작성하러 가기
          </Button>
        </View>
      </View>
    </View>
  );
}
