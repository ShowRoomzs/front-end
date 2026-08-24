import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Typography from "@/common/components/Typography/Typography";
import { useModal } from "@/common/providers/ModalProvider";
import { useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import { requestIdentityVerification } from "@/features/auth/services/identityVerificationService";

/**
 * C0-2 본인인증 — 소셜 로그인과 회원가입 사이의 별도 화면.
 *
 * 한 화면으로 합치지 않은 이유는 PASS 앱으로 **이탈했다 복귀하는 절차**이기 때문이다. 입력 폼과
 * 같은 화면에 있으면 복귀 시 상태 복원과 실패·타임아웃 분기가 얽힌다. 인증이 앞에 서면
 * 미성년·명의도용을 가입 완료 전에 걸러 내고, 뒤따르는 회원가입에는 닉네임과 약관만 남는다.
 *
 * 인증 이유 3가지를 먼저 밝히는 것은 개인정보 요구에 대한 이탈을 줄이는 가장 효과적인 방법이다.
 * 문자(SMS) 인증은 별도 버튼으로 두지 않았다 — PASS 인증창 안에 이미 있고, 선택지를 늘리면
 * "앱이 있어야 하나?" 하는 망설임만 생긴다. 안내 한 줄로 대신한다.
 */
const VERIFY_REASONS = [
  {
    key: "payment",
    title: "명의도용 결제를 막기 위해",
    description: "주문자와 결제자가 같은지 확인합니다",
    icon: (
      <>
        <Path
          d="M12 3.5l7.5 3v6c0 4.2-3 7-7.5 8-4.5-1-7.5-3.8-7.5-8v-6z"
          stroke="#0F0F0F"
          strokeWidth={1.6}
          strokeLinejoin="miter"
        />
        <Path d="M8.8 12.2l2.4 2.4 4-4.6" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
      </>
    ),
  },
  {
    key: "age",
    title: "만 14세 이상인지 확인하기 위해",
    description: "법령에 따라 만 14세 미만은 가입할 수 없습니다",
    icon: (
      <>
        <Path d="M4.5 6.5h15v13h-15z" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
        <Path d="M4.5 10.5h15" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
        <Path d="M8.5 4v3" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
        <Path d="M15.5 4v3" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
      </>
    ),
  },
  {
    key: "order",
    title: "주문과 교환·환불을 위해",
    description: "주문 조회와 반품 접수 시에 사용됩니다",
    icon: (
      <>
        <Path d="M4.4 7.5h15.2l-1.1 12.3H5.5z" stroke="#0F0F0F" strokeWidth={1.6} strokeLinejoin="miter" />
        <Path
          d="M8.8 10V6.6a3.2 3.2 0 0 1 6.4 0V10"
          stroke="#0F0F0F"
          strokeWidth={1.6}
          strokeLinejoin="miter"
        />
      </>
    ),
  },
];

export default function IdentityVerifyView() {
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.IDENTITY_VERIFY>>();
  const navigation = useAuthNavigation();
  const { bottom } = useSafeAreaInsets();
  const { show: showModal } = useModal();

  const { registerToken, onSuccessLogin } = route.params;
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePressBack = useCallback(() => {
    showModal({
      title: "인증을 그만두시겠어요?",
      message: "본인인증을 마쳐야 가입이 완료돼요.\n지금 나가면 로그인 화면으로 돌아갑니다.",
      buttons: [
        { label: "나가기", variant: "outline", onPress: () => navigation.goBack() },
        { label: "이어서 하기" },
      ],
    });
  }, [navigation, showModal]);

  const runVerification = useCallback(async () => {
    setIsVerifying(true);
    try {
      const result = await requestIdentityVerification();

      if (result.status === "AGE_RESTRICTED") {
        navigation.navigate(AUTH_ROUTES.AGE_RESTRICTED);
        return;
      }
      if (result.status === "FAILED") {
        navigation.navigate(AUTH_ROUTES.VERIFY_FAILED, { registerToken, onSuccessLogin });
        return;
      }
      navigation.navigate(AUTH_ROUTES.SIGN_UP, { registerToken, onSuccessLogin });
    } finally {
      setIsVerifying(false);
    }
  }, [navigation, onSuccessLogin, registerToken]);

  /**
   * 외부 앱으로 넘어갔다 돌아오는 절차라 대기 모달을 먼저 띄운다 — 이탈 직전에 남은 시간과
   * 복귀 안내를 명시하지 않으면, 돌아오지 못했을 때 무엇이 잘못됐는지 알 수 없다.
   */
  const handlePressVerify = useCallback(() => {
    showModal({
      iconBackgroundColor: "#FEF4F6",
      icon: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 6v6l4 2"
            stroke="#F2456E"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={12} r={8.5} stroke="#F2456E" strokeWidth={1.8} />
        </Svg>
      ),
      title: "PASS 앱에서 인증을 진행해 주세요",
      message: "인증을 마치면 이 화면으로 돌아와\n가입이 이어집니다",
      buttons: [
        { label: "취소", variant: "outline" },
        { label: "PASS 열기", onPress: runVerification },
      ],
    });
  }, [runVerification, showModal]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="본인인증" onPressBack={handlePressBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14 pb-22 pt-26">
          <Typography
            style={{ fontSize: 19, fontWeight: "700", lineHeight: 28.5, letterSpacing: -0.5 }}
            className="text-ink"
          >
            {"가입을 위해\n본인인증을 해주세요"}
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 9 }} className="text-gray45">
            한 번만 인증하면 주문할 때 다시 하지 않아도 돼요
          </Typography>
        </View>

        <GroupBand height={5} />

        <SectionLabel label="인증하는 이유" className="pb-4 pt-20" />
        <View className="px-14 pt-8" style={{ gap: 14 }}>
          {VERIFY_REASONS.map(reason => (
            <View key={reason.key} className="flex-row" style={{ gap: 11 }}>
              <View style={{ marginTop: 1 }}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  {reason.icon}
                </Svg>
              </View>
              <View className="min-w-0 flex-1">
                <Typography
                  style={{ fontSize: 14, fontWeight: "600", lineHeight: 19.6 }}
                  className="text-ink"
                >
                  {reason.title}
                </Typography>
                <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 3 }} className="text-gray45">
                  {reason.description}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        <View className="h-20" />
      </ScrollView>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ gap: 9, paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handlePressVerify}
          disabled={isVerifying}
          activeOpacity={0.75}
          className={`h-52 flex-row items-center justify-center rounded-base ${
            isVerifying ? "bg-fill" : "bg-rose"
          }`}
        >
          <Typography variant="buttonPrimary" className={isVerifying ? "text-gray71" : "text-white"}>
            {isVerifying ? "인증 진행 중…" : "PASS로 인증하기"}
          </Typography>
        </TouchableOpacity>

        <Typography
          style={{ fontSize: 12, lineHeight: 19.2, paddingTop: 4, paddingBottom: 2 }}
          className="text-center text-gray45"
        >
          PASS 앱이 없어도 문자로 인증할 수 있어요
        </Typography>
      </View>
    </View>
  );
}
