import { useCallback, useMemo } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import Icon from "@/common/components/Icon/Icon";
import VStack from "@/common/components/VStack/VStack";
import { useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import SocialButton, { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { SocialLoginResponse } from "@/features/auth/hooks/useSocialLogin";
import { useSocialLoginMutation } from "@/features/auth/hooks/useSocialLoginMutation";

export default function AuthHomeView() {
  const navigation = useAuthNavigation();
  const { mutateAsync: socialLoginAsync } = useSocialLoginMutation();
  const socialButtons = useMemo((): Array<SocialType> => {
    const buttons: Array<SocialType> = ["KAKAO", "NAVER"];

    if (Platform.OS === "ios") {
      buttons.push("APPLE");
    }

    if (Platform.OS === "android") {
      buttons.push("GOOGLE");
    }

    return buttons;
  }, []);

  const handlePressSocialButton = useCallback(
    async (response: SocialLoginResponse) => {
      const { providerType, token } = response;

      const res = await socialLoginAsync({
        token,
        providerType,
      });

      console.log("res", res);
    },
    [socialLoginAsync]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan().onEnd(e => {
        const { velocityY, translationY } = e;
        // 스와이프 다운 시 모달 닫기

        if (velocityY > 100 && translationY > 10) {
          runOnJS(navigation.goBack)();
        }
      }),
    [navigation.goBack]
  );

  return (
    <GestureDetector gesture={pan}>
      <View className="bg-black flex-1 flex items-center justify-center">
        <VStack gap={45} className="w-full">
          <Icon icon={COMMON_ASSETS.logo} className="self-center" />
          <VStack gap={20} className="w-full px-20">
            {socialButtons.map(socialType => (
              <SocialButton onPress={handlePressSocialButton} key={socialType} socialType={socialType} />
            ))}
          </VStack>
          <Pressable
            className="bg-white w-100 h-50"
            onPress={() => navigation.navigate(AUTH_ROUTES.SIGN_UP, {})}
          >
            <Text>회원가입 라우팅</Text>
          </Pressable>
        </VStack>
      </View>
    </GestureDetector>
  );
}
