import { RouteProp, useRoute } from "@react-navigation/native";
import { AxiosError } from "axios";
import { useCallback, useMemo } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { AuthStackParamList, useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import SocialButton, { SocialType } from "@/features/auth/components/SocialButton/SocialButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { SocialLoginResponse } from "@/features/auth/hooks/useSocialLogin";

export default function AuthHomeView() {
  const navigation = useAuthNavigation();
  const { bottom } = useSafeAreaInsets();
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

  /**
   * 소셜 SDK 인증이 끝난 뒤 서버에 토큰을 넘기는 단계다.
   *
   * 여기서 실패해도 화면에는 아무 변화가 없어(로그인 시트는 이미 닫혔다) "깜빡이고 끝"으로만
   * 보인다 — SDK 실패인지 서버 실패인지 구분이 안 되므로, 어느 단계에서 깨졌는지 사유와 함께 알린다.
   */
  const handlePressSocialButton = useCallback(
    async (response: SocialLoginResponse) => {
      const { providerType, token } = response;

      try {
        const res = await socialLoginAsync({
          token,
          providerType,
          // TODO : fcmToken, name(apple) 추가
        });

        const { isNewMember } = res;

        // 신규 회원은 본인인증(C0-2)을 거쳐 회원가입(C0-1)으로 간다.
        // isNewMember가 true면 registerToken은 반드시 존재한다.
        if (isNewMember) {
          navigation.navigate(AUTH_ROUTES.IDENTITY_VERIFY, {
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
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;

        console.error("[social-login] 서버 인증 실패", {
          providerType,
          status,
          data: axiosError.response?.data,
        });
        toast.show(
          `로그인 처리에 실패했어요 (${status ?? "네트워크"}: ${serverMessage ?? axiosError.message})`
        );
      }
    },
    [login, navigation, params, socialLoginAsync]
  );

  const handlePressServiceTerms = useCallback(() => {
    navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "service" });
  }, [navigation]);

  const handlePressPrivacyTerms = useCallback(() => {
    navigation.navigate(AUTH_ROUTES.TERMS, { termsType: "privacy" });
  }, [navigation]);

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
      <View className="flex-1 bg-white">
        {/* 로그인은 흐름을 잠시 덮는 화면이라는 신호로 뒤로가기 대신 우측 상단 X를 둔다 */}
        <View className="h-46 flex-row items-center justify-end px-8">
          <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.5} className="p-11">
            <CloseIcon size={23} thickness={1.9} color="#0F0F0F" />
          </TouchableOpacity>
        </View>

        {/* 워드마크와 가치 문구는 가운데 정렬이다 — 아래 소셜 버튼 3개가 화면을 가로로 꽉
            채우고 있어, 좌측 정렬로 두면 위아래 축이 어긋나 보인다 */}
        <View className="flex-1 items-center justify-center px-24" style={{ paddingBottom: 24 }}>
          {/* 디자인 지정 워드마크 — 밝은 배경이라 color(로즈)를 쓴다. 높이 26 고정 */}
          <Icon icon={COMMON_ASSETS.wordmarkColor} width={242} height={26} />
          <Typography
            style={{
              fontSize: 21,
              fontWeight: "700",
              lineHeight: 30.45,
              letterSpacing: -0.6,
              marginTop: 16,
            }}
            className="text-center text-ink"
          >
            {"팔로우한 쇼룸의 공구를\n놓치지 마세요"}
          </Typography>
          <Typography
            style={{ fontSize: 13.5, lineHeight: 22.3, marginTop: 10 }}
            className="text-center text-gray45"
          >
            {"좋아하는 인플루언서의 공동구매를\n가장 먼저 알려드려요"}
          </Typography>
        </View>

        <View className="px-24" style={{ gap: 10 }}>
          {socialButtons.map(socialType => (
            <SocialButton onPress={handlePressSocialButton} key={socialType} socialType={socialType} />
          ))}
        </View>

        {/* 약관 두 곳에는 밑줄을 둔다 — 회색 11px 안내문 안에서 밑줄 말고는
            눌리는 곳이라는 신호를 줄 방법이 없다 */}
        <View className="px-24" style={{ paddingTop: 18, paddingBottom: bottom + 12 }}>
          <Typography variant="legal" className="text-center text-gray45">
            {"계속하면 "}
            <Typography
              variant="legal"
              className="text-gray45"
              style={{ textDecorationLine: "underline" }}
              onPress={handlePressServiceTerms}
            >
              서비스 이용약관
            </Typography>
            {" 및 "}
            <Typography
              variant="legal"
              className="text-gray45"
              style={{ textDecorationLine: "underline" }}
              onPress={handlePressPrivacyTerms}
            >
              개인정보 처리방침
            </Typography>
            {"에\n동의하는 것으로 간주됩니다 · 만 14세 이상만 가입할 수 있어요"}
          </Typography>
        </View>
      </View>
    </GestureDetector>
  );
}
