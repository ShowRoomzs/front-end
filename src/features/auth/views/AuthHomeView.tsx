import { useMemo } from "react";
import { Platform, View } from "react-native";

import SocialButton, { SocialButtonProps } from "../components/SocialButton/SocialButton";
import { useNaverLogin } from "../hooks/useNaverLogin";

import Icon from "@/common/components/Icon/Icon";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";

export default function AuthHomeView() {
  const { login: loginWithNaver } = useNaverLogin();

  const socialButtons = useMemo((): Array<SocialButtonProps> => {
    const buttons: Array<SocialButtonProps> = [
      {
        socialType: "naver",
        onPress: loginWithNaver,
      },
      {
        socialType: "google",
        onPress: () => {},
      },
    ];

    if (Platform.OS === "ios") {
      buttons.push({
        socialType: "apple",
        onPress: () => {},
      });
    }
    return buttons;
  }, [loginWithNaver]);

  return (
    <View className="bg-black flex-1 flex items-center justify-center">
      <VStack gap={45} className="w-full">
        <Icon icon={COMMON_ASSETS.logo} className="self-center" />
        <VStack gap={20} className="w-full px-20">
          {socialButtons.map(socialButton => (
            <SocialButton
              key={socialButton.socialType}
              socialType={socialButton.socialType}
              onPress={socialButton.onPress}
            />
          ))}
        </VStack>
      </VStack>
    </View>
  );
}
