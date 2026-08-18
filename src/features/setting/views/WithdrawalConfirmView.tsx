import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import Checkbox from "@/common/components/Checkbox/Checkbox";
import HStack from "@/common/components/HStack/HStack";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { modal } from "@/common/providers/ModalProvider";
import { HOME_ROUTES, SETTINGS_ROUTES, SettingsStackParamList, useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { useWithdrawlMutation } from "@/features/setting/hooks/useWithdrawlMutation";

const WARNING_ITEMS = [
  {
    text: "동일한 이메일이나 휴대폰 번호로는 30일 동안 재가입 및 등록할 수 없습니다",
    isHighlight: true,
  },
  {
    text: "현재 보유 중인 쿠폰, 포인트는 모두 소멸되며 재가입 후에도 복구할 수 없습니다.",
    isHighlight: false,
  },
  {
    text: "유/무상 전용 포인트는 탈퇴 시 모두 소멸되며 재가입 후에도 복구할 수 없습니다.",
    isHighlight: false,
  },
];

export default function WithdrawalConfirmView() {
  const settingsNavigation = useSettingsNavigation();
  const route = useRoute<RouteProp<SettingsStackParamList, typeof SETTINGS_ROUTES.WITHDRAWAL_CONFIRM>>();
  const { navigate } = useBottomTab();
  const { selectedReason } = route.params;
  const { mutateAsync: withdrawl } = useWithdrawlMutation();
  const { user } = useUserStore();
  const [isAgreed, setIsAgreed] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  const handlePressContinue = () => {
    settingsNavigation.goBack();
    settingsNavigation.goBack();
  };

  const handlePressWithdraw = async () => {
    try {
      await withdrawl({
        agreeConsent: isAgreed,
        reason: selectedReason,
        customReason: null,
      });
      modal.alert({
        title: "회원 탈퇴",
        message: "회원 탈퇴가 완료되었습니다.",
        confirmLabel: "확인",
        onConfirm: () => {
          settingsNavigation.goBack();
          settingsNavigation.goBack();
          navigate(HOME_ROUTES.HOME);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <ScreenHeader title="회원탈퇴" onPressBack={handlePressBack} />
      <VStack className="pt-25" gap={15}>
        <VStack className="px-20" gap={0}>
          <Typography className="text-black text-20 font-semibold">
            {user?.nickname}님의{"\n"}모든 혜택이 사라져요!
          </Typography>
        </VStack>
        <VStack className="bg-gray0 px-20 py-20" gap={10}>
          <View className="flex-row justify-between items-center border-[1px] border-gray2 bg-white rounded-[5px] px-15 py-15">
            <Typography className="text-gray10 text-14 font-normal">잔여 포인트.</Typography>
            <Typography className="text-pointColor text-16 font-medium">{`${user?.point} P`}</Typography>
          </View>
          <View className="flex-row justify-between items-center border-[1px] border-gray2 bg-white rounded-[5px] px-15 py-15">
            <Typography className="text-gray10 text-14 font-normal">잔여 쿠폰.</Typography>
            <Typography className="text-pointColor text-16 font-medium">{`${user?.couponCount} 개`}</Typography>
          </View>
        </VStack>
        <VStack className="px-20" gap={8}>
          <Typography className="text-black text-13 font-medium">유의사항</Typography>
          <VStack className="bg-gray0 border-[1px] border-gray2 rounded-[5px] px-15 py-15" gap={0}>
            {WARNING_ITEMS.map((item, ix) => (
              <View key={ix}>
                <Typography
                  className={`text-11 font-normal py-8 ${item.isHighlight ? "text-negativeColor" : "text-gray12"}`}
                >
                  {item.text}
                </Typography>
                {ix !== WARNING_ITEMS.length - 1 && <View className="h-[1px] bg-gray2" />}
              </View>
            ))}
          </VStack>
        </VStack>
      </VStack>
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-gray2 bg-white px-10 pt-15"
        style={{ paddingBottom: insets.bottom + 15, gap: 16 }}
      >
        <Pressable onPress={() => setIsAgreed(prev => !prev)}>
          <HStack className="items-center" gap={10}>
            <Checkbox isChecked={isAgreed} onChange={setIsAgreed} />
            <HStack className="items-center" gap={6}>
              <Typography className="text-black text-13 font-medium">
                위 내용을 숙지하셨으며 탈퇴에 동의합니다
              </Typography>
              <Typography className="text-gray9 text-13 font-normal">(필수)</Typography>
            </HStack>
          </HStack>
        </Pressable>
        <HStack gap={6}>
          <Button className="flex-1" size="xl" variant="primary" onPress={handlePressContinue}>
            계속 사용하기
          </Button>
          <Button
            className="flex-1"
            size="xl"
            variant="secondary-black"
            onPress={handlePressWithdraw}
            disabled={!isAgreed}
          >
            회원 탈퇴하기
          </Button>
        </HStack>
      </View>
    </View>
  );
}
