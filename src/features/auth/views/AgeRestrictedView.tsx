import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import AuthNoticeLayout from "@/features/auth/components/AuthNoticeLayout/AuthNoticeLayout";

/**
 * C0 만 14세 미만 차단 — 본인인증 결과가 만 14세 미만일 때 회원가입에 닿기 전에 여기로 보낸다.
 *
 * 재시도 여지를 주지 않는 **단일 [확인]**만 둔다. 나이는 재시도로 달라지는 값이 아니라서
 * [다시 시도]를 두면 될 때까지 눌러 보게 만들 뿐이다.
 *
 * 문구는 사용자를 탓하지 않고 법령 근거를 밝히며, 미성년이 놀라지 않도록 **인증 정보 즉시 폐기**를
 * 함께 고지한다(개인정보 최소수집 원칙). 아이콘도 경고 삼각형 대신 중립적 상태 알림을 쓴다.
 */
export default function AgeRestrictedView() {
  const navigation = useAuthNavigation();

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader onPressBack={() => navigation.navigate(AUTH_ROUTES.AUTH_HOME, {})} />

      <AuthNoticeLayout
        iconBackgroundColor="#FEF4F6"
        icon={
          <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={8.5} stroke="#F2456E" strokeWidth={1.7} />
            <Path d="M12 7.6v5" stroke="#F2456E" strokeWidth={1.7} strokeLinecap="round" />
            <Path d="M12 16.1v.1" stroke="#F2456E" strokeWidth={1.7} strokeLinecap="round" />
          </Svg>
        }
        title={"만 14세 이상만\n가입할 수 있어요"}
        description={"본인인증 결과 만 14세 미만으로 확인되어\n관련 법령에 따라 가입이 제한됩니다."}
        notice={"인증 정보는 가입 가능 여부 확인에만 쓰이고\n즉시 폐기됩니다"}
        footer={
          <TouchableOpacity
            onPress={() => navigation.navigate(AUTH_ROUTES.AUTH_HOME, {})}
            activeOpacity={0.75}
            className="h-52 flex-row items-center justify-center rounded-base bg-rose"
          >
            <Typography variant="buttonPrimary" className="text-white">
              확인
            </Typography>
          </TouchableOpacity>
        }
      />
    </View>
  );
}
