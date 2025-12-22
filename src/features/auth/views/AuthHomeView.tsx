import { useCallback, useMemo } from "react";
import { Platform, View } from "react-native";

import SocialButton, { SocialType } from "../components/SocialButton/SocialButton";
import { SocialLoginResponse } from "../hooks/useSocialLogin";

import Icon from "@/common/components/Icon/Icon";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function AuthHomeView() {
  const socialButtons = useMemo((): Array<SocialType> => {
    const buttons: Array<SocialType> = ["naver", "google"];

    if (Platform.OS === "ios") {
      buttons.push("apple");
    }
    return buttons;
  }, []);

  const handlePressSocialButton = useCallback((response: SocialLoginResponse) => {
    console.log(response);
    // TODO : 서버 요청
  }, []);

  return (
    <View className="bg-black flex-1 flex items-center justify-center">
      <VStack gap={45} className="w-full">
        <Icon icon={COMMON_ASSETS.logo} className="self-center" />
        <VStack gap={20} className="w-full px-20">
          {socialButtons.map(socialType => (
            <SocialButton onPress={handlePressSocialButton} key={socialType} socialType={socialType} />
          ))}
        </VStack>
      </VStack>
    </View>
  );
}
