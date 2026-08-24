import { RouteProp, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useAuthNavigation } from "@/common/router";
import { AUTH_ROUTES } from "@/common/router/routes";
import { AuthStackParamList } from "@/common/router/types";
import AuthNoticeLayout from "@/features/auth/components/AuthNoticeLayout/AuthNoticeLayout";

/**
 * C0 PASS 인증 실패 · 타임아웃.
 *
 * 시간 초과 · 창 닫힘 · 통신사 불일치를 한 화면으로 묶는다 — 사용자에게는 원인 구분보다
 * "다시 하면 된다"가 중요하다.
 *
 * 14세 차단과 **결정적으로 다른 점**은 재시도가 정상 경로라는 것이다. 그래서 [다시 인증하기]가
 * 로즈 채움 주액션이고, 앱 문제로 계속 막힐 때를 위한 [문자로 인증하기]를 보조로 둔다.
 * 시계 아이콘은 회색(중립)이다 — 실패는 오류가 아니라 일시적 중단이라 로즈/경고색을 쓰지 않는다.
 */
export default function VerifyFailedView() {
  const route = useRoute<RouteProp<AuthStackParamList, typeof AUTH_ROUTES.VERIFY_FAILED>>();
  const navigation = useAuthNavigation();
  const { registerToken, onSuccessLogin } = route.params;

  const handleRetry = () => {
    navigation.navigate(AUTH_ROUTES.IDENTITY_VERIFY, { registerToken, onSuccessLogin });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="본인인증" onPressBack={navigation.goBack} />

      <AuthNoticeLayout
        iconBackgroundColor="#F4F4F5"
        icon={
          <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 6v6l4 2"
              stroke="#8E8E8E"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx={12} cy={12} r={8.5} stroke="#8E8E8E" strokeWidth={1.7} />
          </Svg>
        }
        title="인증이 완료되지 않았어요"
        description={"시간이 초과되었거나 인증 창이 닫혔어요.\n잠시 후 다시 시도해 주세요."}
        notice={"계속 실패하면 PASS 앱이 최신 버전인지\n확인하거나 문자 인증을 이용해 주세요"}
        footer={
          <>
            <TouchableOpacity
              onPress={handleRetry}
              activeOpacity={0.75}
              className="h-52 flex-row items-center justify-center rounded-base bg-rose"
            >
              <Typography variant="buttonPrimary" className="text-white">
                다시 인증하기
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toast.show("문자 인증은 PASS 인증창에서 선택할 수 있어요")}
              activeOpacity={0.5}
              className="h-44 flex-row items-center justify-center"
            >
              <Typography
                style={{ fontSize: 13.5, fontWeight: "500", lineHeight: 13.5 }}
                className="text-gray45"
              >
                문자로 인증하기
              </Typography>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}
