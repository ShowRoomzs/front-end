import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { AuthStackParamList, useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import SocialButton, { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { SocialLoginResponse } from "@/features/auth/hooks/useSocialLogin";

export default function AuthHomeView() {
  const navigation = useAuthNavigation();
  const { socialLoginMutation } = useAuth();
  const { login } = useLogin();
  const { mutateAsync: socialLoginAsync } = socialLoginMutation;
  const { params } = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.AUTH_HOME>>();
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
        // TODO : fcmToken, name(apple) 추가
      });

      const { isNewMember } = res;

      // isNewMember가 true인 경우 registerToken은 반드시 존재
      if (isNewMember) {
        navigation.navigate(AUTH_ROUTES.SIGN_UP, {
          registerToken: res.registerToken!,
          onSuccessLogin: params.onSuccessLogin,
        });
        return;
      }
      await login(res);
      navigation.goBack();
      setTimeout(() => {
        params.onSuccessLogin?.();
      }, 500);
    },
    [login, navigation, params, socialLoginAsync]
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
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white">
        {/* 로그인은 흐름을 잠시 덮는 화면이라는 신호로 뒤로가기 대신 우측 상단 X를 둔다 */}
        <View className="h-46 flex-row items-center justify-end px-8">
          <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.5} className="p-11">
            <CloseIcon size={20} color="#0F0F0F" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center px-20">
          <Icon icon={COMMON_ASSETS.logoBlack} className="self-start" />
          <Typography
            style={{ fontSize: 22, fontWeight: "700", lineHeight: 31, letterSpacing: -0.5, marginTop: 24 }}
            className="text-ink"
          >
            {"팔로우한 쇼룸의 공구를\n놓치지 마세요"}
          </Typography>
          <Typography variant="promptBody" className="mt-10 text-gray45">
            {"좋아하는 인플루언서의 공동구매를\n가장 먼저 알려드려요"}
          </Typography>
        </View>

        <View className="px-20 pb-20" style={{ gap: 10 }}>
          {socialButtons.map(socialType => (
            <SocialButton onPress={handlePressSocialButton} key={socialType} socialType={socialType} />
          ))}
          <Typography variant="legal" className="mt-12 text-center text-gray45">
            {
              "계속하면 서비스 이용약관 및 개인정보 처리방침에\n동의하는 것으로 간주됩니다 · 만 14세 이상만 가입할 수 있어요"
            }
          </Typography>
        </View>
      </SafeAreaView>
    </GestureDetector>
  );
}
