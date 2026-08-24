import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useModal } from "@/common/providers/ModalProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useAuthNavigation, useMainNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import TermsAgreementList, {
  INITIAL_TERMS,
  REQUIRED_TERMS,
  TermsAgreementState,
  TermsKey,
} from "@/features/auth/components/TermsAgreementList/TermsAgreementList";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { TermsType } from "@/features/auth/views/TermsView";
import NicknameField from "@/features/user/components/NicknameField/NicknameField";
import { useNicknameCheck } from "@/features/user/hooks/useNicknameCheck";

/**
 * C0-1 회원가입 — 최초 소셜 로그인 뒤 이어지는 단계.
 *
 * 입력받는 것은 **닉네임과 약관 동의 둘뿐**이다. 실명·생년월일·성별은 서버가 본인인증 결과로
 * 채우므로 여기서 묻지 않는다 — 물어볼수록 이탈이 늘고, 사용자 입력값이 더 정확하지도 않다.
 *
 * 뒤로가기는 곧장 나가지 않고 확인 모달을 띄운다. 소셜 인증은 이미 끝났지만 약관 동의 전이라
 * 계정이 생성되지 않은 상태여서, 그냥 나가면 입력이 사라진다는 점을 알려야 한다.
 */
const TERMS_DETAIL_MAP: Partial<Record<TermsKey, TermsType>> = {
  service: "service",
  privacy: "privacy",
  marketing: "marketing",
};

export default function SignUpView() {
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.SIGN_UP>>();
  const authNavigation = useAuthNavigation();
  const navigation = useMainNavigation();
  const { bottom } = useSafeAreaInsets();
  const { show: showModal } = useModal();

  const { onSuccessLogin, registerToken } = route.params || {};
  const { registerMutation } = useAuth();
  const { mutateAsync: registerAsync, isPending } = registerMutation;
  const { login } = useLogin();

  const [nickname, setNickname] = useState("");
  const [terms, setTerms] = useState<TermsAgreementState>(INITIAL_TERMS);

  const { isAvailable, isError, message } = useNicknameCheck(nickname);

  const hasRequiredTerms = REQUIRED_TERMS.every(key => terms[key]);
  const canSubmit = isAvailable && hasRequiredTerms && !isPending;

  const handlePressBack = useCallback(() => {
    showModal({
      title: "가입을 그만두시겠어요?",
      message: "지금까지 입력한 정보는 저장되지 않아요.",
      buttons: [
        // 파괴적 선택이 좌측 중립, 머무르는 선택이 우측 로즈
        { label: "나가기", variant: "outline", onPress: () => authNavigation.goBack() },
        { label: "이어서 하기" },
      ],
    });
  }, [authNavigation, showModal]);

  const handlePressDetail = useCallback(
    (key: TermsKey) => {
      const termsType = TERMS_DETAIL_MAP[key];

      if (termsType) {
        authNavigation.navigate(AUTH_ROUTES.TERMS, { termsType });
      }
    },
    [authNavigation]
  );

  const handleSubmit = useCallback(async () => {
    if (!registerToken || !canSubmit) {
      return;
    }

    try {
      const res = await registerAsync({
        request: {
          nickname: nickname.trim(),
          ageAgree: terms.age,
          serviceAgree: terms.service,
          privacyAgree: terms.privacy,
          marketingAgree: terms.marketing,
        },
        registerToken,
      });

      await login(res);

      const parent = navigation.getParent();

      if (parent) {
        parent.dispatch(CommonActions.goBack());
      }
      setTimeout(() => {
        onSuccessLogin?.();
      }, 500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      toast.show(axiosError.response?.data?.message ?? "가입에 실패했어요. 잠시 후 다시 시도해 주세요");
    }
  }, [canSubmit, login, navigation, nickname, onSuccessLogin, registerAsync, registerToken, terms]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="회원가입" onPressBack={handlePressBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="border-b-[0.5px] border-dividerProduct px-14 pb-20 pt-22">
          <Typography
            style={{ fontSize: 18, fontWeight: "700", lineHeight: 27, letterSpacing: -0.5 }}
            className="text-ink"
          >
            {"거의 다 왔어요!\n닉네임만 정하면 끝이에요"}
          </Typography>
        </View>

        <View className="px-14 pb-20 pt-20">
          <NicknameField
            value={nickname}
            onChangeText={setNickname}
            isError={isError}
            isAvailable={isAvailable}
            message={message}
            autoFocus
          />
        </View>

        <GroupBand height={5} />

        <TermsAgreementList value={terms} onChange={setTerms} onPressDetail={handlePressDetail} />
      </ScrollView>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.75}
          className={`h-52 flex-row items-center justify-center rounded-base ${
            canSubmit ? "bg-rose" : "bg-fill"
          }`}
        >
          <Typography variant="buttonPrimary" className={canSubmit ? "text-white" : "text-gray71"}>
            동의하고 가입 완료
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
