import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useModal } from "@/common/providers/ModalProvider";
import { toast } from "@/common/providers/ToastProvider";
import { HOME_ROUTES, SETTINGS_ROUTES, useSettingsNavigation } from "@/common/router";
import { SettingsStackParamList } from "@/common/router/types";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useGetWithdrawalInfo } from "@/features/setting/hooks/useWithdrawal";
import { useWithdrawlMutation } from "@/features/setting/hooks/useWithdrawlMutation";

/**
 * C15-4 회원 탈퇴 2단계 — 확인.
 *
 * 차단 사유(있을 때) → 결과 고지 3가지 → 하단 동의 + [탈퇴하기].
 *
 * 삭제되는 것과 **법정 기간 보관되는 것**을 나눠 적는다. 전자상거래법상 거래 기록은 즉시
 * 폐기할 수 없으므로 "모두 삭제된다"고만 쓰면 사실과 다르다.
 *
 * 하단은 [탈퇴하기](좌·중립 외곽선 — 로즈를 쓰지 않는다)와 [계속 사용하기](우·로즈)다.
 * 파괴적 액션을 강조하지 않고, 오른손 엄지가 닿는 쪽을 머무르는 선택으로 둔다.
 */
const NOTICE_ICON_PROPS = {
  stroke: "#0F0F0F",
  strokeWidth: 1.6,
  strokeLinejoin: "miter",
} as const;

/** 아이콘은 디자인의 각진 라인 세트를 그대로 쓴다 — 휴지통 · 문서 · 방패 */
const WITHDRAWAL_NOTICES = [
  {
    key: "account",
    title: "계정과 활동 기록이 삭제돼요",
    description: "닉네임·프로필 사진·팔로잉·좋아요·장바구니가 모두 사라지고 되돌릴 수 없어요",
    icon: (
      <>
        <Path d="M5.5 7.5h13l-1 12h-11z" {...NOTICE_ICON_PROPS} />
        <Path d="M9.5 11v5" {...NOTICE_ICON_PROPS} />
        <Path d="M14.5 11v5" {...NOTICE_ICON_PROPS} />
        <Path d="M9 5h6" {...NOTICE_ICON_PROPS} />
      </>
    ),
  },
  {
    key: "order",
    title: "주문·결제 기록은 일정 기간 보관돼요",
    description: "전자상거래법에 따라 거래 기록은 법정 기간 동안 분리 보관 후 파기합니다",
    icon: (
      <>
        <Path d="M6 4.5h9l3.5 3.5v11.5h-12.5z" {...NOTICE_ICON_PROPS} />
        <Path d="M9 12.5h6" {...NOTICE_ICON_PROPS} />
        <Path d="M9 16h4" {...NOTICE_ICON_PROPS} />
      </>
    ),
  },
  {
    key: "rejoin",
    title: "같은 계정으로 다시 가입할 수 있어요",
    description: "다만 이전 활동 기록은 복구되지 않고 새 계정으로 시작해요",
    icon: (
      <>
        <Path d="M12 3.5l7.5 3v6c0 4.2-3 7-7.5 8-4.5-1-7.5-3.8-7.5-8v-6z" {...NOTICE_ICON_PROPS} />
        <Path d="M12 9v4" {...NOTICE_ICON_PROPS} />
        <Path d="M12 15.6v.2" {...NOTICE_ICON_PROPS} />
      </>
    ),
  },
];

export default function WithdrawalConfirmView() {
  const route = useRoute<RouteProp<SettingsStackParamList, typeof SETTINGS_ROUTES.WITHDRAWAL_CONFIRM>>();
  const navigation = useSettingsNavigation();
  const { bottom } = useSafeAreaInsets();
  const { navigate } = useBottomTab();
  const { show: showModal } = useModal();
  const { logout } = useLogin();

  const { reason, customReason } = route.params ?? {};
  const { data: info, isLoading } = useGetWithdrawalInfo();
  const { mutateAsync: withdraw, isPending } = useWithdrawlMutation();

  const [agreeConsent, setAgreeConsent] = useState(false);

  const isBlocked = !!info && !info.withdrawable;
  const canWithdraw = agreeConsent && !isBlocked && !isPending;

  const handleComplete = useCallback(async () => {
    await logout();
    navigation.goBack();
    setTimeout(() => {
      navigate(HOME_ROUTES.HOME);
    }, 500);
  }, [logout, navigate, navigation]);

  const handleWithdraw = useCallback(async () => {
    try {
      await withdraw({ agreeConsent: true, reason, customReason });
      showModal({
        iconBackgroundColor: "#F4F4F5",
        icon: (
          <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4.5 12.5l5 5 10-11"
              stroke="#3C3C3C"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ),
        title: "탈퇴가 완료되었습니다",
        message: "그동안 쇼룸즈를 이용해 주셔서 감사했어요.",
        buttons: [{ label: "확인", onPress: handleComplete }],
      });
    } catch {
      toast.show("탈퇴 처리에 실패했어요. 잠시 후 다시 시도해 주세요");
    }
  }, [customReason, handleComplete, reason, showModal, withdraw]);

  const handlePressWithdraw = useCallback(() => {
    if (!canWithdraw || !info) {
      return;
    }
    showModal({
      title: "정말 탈퇴하시겠어요?",
      message: `팔로잉 ${info.followingCount}곳과 좋아요 ${info.wishlistCount}개가\n모두 삭제되고 되돌릴 수 없어요`,
      buttons: [{ label: "탈퇴하기", variant: "outline", onPress: handleWithdraw }, { label: "취소" }],
    });
  }, [canWithdraw, handleWithdraw, info, showModal]);

  if (isLoading || !info) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="회원 탈퇴" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="회원 탈퇴" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14 pb-20 pt-24">
          <Typography
            style={{ fontSize: 18, fontWeight: "700", lineHeight: 27, letterSpacing: -0.5 }}
            className="text-ink"
          >
            {"탈퇴하기 전에\n아래 내용을 확인해 주세요"}
          </Typography>
        </View>

        {isBlocked && (
          <View className="mx-14 mb-20 overflow-hidden rounded-base border-[1px] border-roseBorder">
            <View className="flex-row bg-roseTint p-14" style={{ gap: 9 }}>
              <View style={{ marginTop: 1 }}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={8.5} stroke="#CF3D61" strokeWidth={1.6} />
                  <Path d="M12 7.6v5.2" stroke="#CF3D61" strokeWidth={2.2} strokeLinecap="round" />
                  <Path d="M12 16.3v.2" stroke="#CF3D61" strokeWidth={2.2} strokeLinecap="round" />
                </Svg>
              </View>
              <View className="min-w-0 flex-1">
                <Typography
                  style={{ fontSize: 14, fontWeight: "600", lineHeight: 20.3 }}
                  className="text-roseText"
                >
                  진행 중인 주문이 있어 지금은 탈퇴할 수 없어요
                </Typography>
                <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 5 }} className="text-ink76">
                  배송과 교환·환불이 모두 끝난 뒤 탈퇴할 수 있어요
                </Typography>
              </View>
            </View>
          </View>
        )}

        <SectionLabel label="탈퇴하면 이렇게 됩니다" className="pb-6 pt-0" />
        <View className="px-14 pt-8" style={{ gap: 15 }}>
          {WITHDRAWAL_NOTICES.map(notice => (
            <View key={notice.key} className="flex-row" style={{ gap: 11 }}>
              <View style={{ marginTop: 1 }}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  {notice.icon}
                </Svg>
              </View>
              <View className="min-w-0 flex-1">
                <Typography
                  style={{ fontSize: 14, fontWeight: "600", lineHeight: 19.6 }}
                  className="text-ink"
                >
                  {notice.title}
                </Typography>
                <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 4 }} className="text-gray45">
                  {notice.description}
                </Typography>
              </View>
            </View>
          ))}
        </View>

        <View className="h-26" />
      </ScrollView>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-14"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={() => !isBlocked && setAgreeConsent(prev => !prev)}
          disabled={isBlocked}
          activeOpacity={0.6}
          className="flex-row items-start pb-14"
          style={{ gap: 10, opacity: isBlocked ? 0.5 : 1 }}
        >
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 21,
              height: 21,
              marginTop: 1,
              borderWidth: 1.5,
              borderColor: agreeConsent ? "#F2456E" : "#DEDEE0",
              backgroundColor: agreeConsent ? "#F2456E" : "#FFFFFF",
            }}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4.5 12.5l5 5 10-11"
                stroke={agreeConsent ? "#FFFFFF" : "#DEDEE0"}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="min-w-0 flex-1 text-ink76">
            <Typography style={{ fontWeight: "600" }} className="text-roseText">
              [필수]
            </Typography>{" "}
            위 내용을 모두 확인했고, 계정과 활동 기록이 삭제되는 데 동의합니다
          </Typography>
        </TouchableOpacity>

        <View className="flex-row" style={{ gap: 8 }}>
          <TouchableOpacity
            onPress={handlePressWithdraw}
            disabled={!canWithdraw}
            activeOpacity={0.6}
            className="h-52 flex-1 flex-row items-center justify-center rounded-base"
            style={{
              borderWidth: 1,
              borderColor: canWithdraw ? "#DCDCDE" : "transparent",
              backgroundColor: canWithdraw ? "#FFFFFF" : "#F4F4F5",
            }}
          >
            <Typography variant="buttonPrimary" className={canWithdraw ? "text-ink76" : "text-gray71"}>
              탈퇴하기
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigation.goBack}
            activeOpacity={0.75}
            className="h-52 flex-1 flex-row items-center justify-center rounded-base bg-rose"
          >
            <Typography variant="buttonPrimary" className="text-white">
              계속 사용하기
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
