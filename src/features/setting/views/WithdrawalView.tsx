import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Radio from "@/common/components/Radio/Radio";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { SETTINGS_ROUTES, useSettingsNavigation } from "@/common/router";
import WithdrawalBottomAction from "@/features/setting/components/WithdrawalBottomAction/WithdrawalBottomAction";
import { WITHDRAWAL_REASONS } from "@/features/setting/constants/withdraw";

export default function WithdrawalView() {
  const settingsNavigation = useSettingsNavigation();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { hide, show } = useBottomTab();
  const handlePressBack = () => {
    settingsNavigation.goBack();
  };
  const handlePressNext = () => {
    if (!selectedReason) {
      return;
    }
    settingsNavigation.navigate(SETTINGS_ROUTES.WITHDRAWAL_CONFIRM, { selectedReason });
  };

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  return (
    <View className="flex-1">
      <ScreenHeader title="회원탈퇴" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={35}>
        <Typography className="text-black text-20 font-semibold">탈퇴하는 사유를 선택해 주세요</Typography>
        <VStack gap={0}>
          {WITHDRAWAL_REASONS.map((reason, ix) => (
            <View key={reason.value}>
              <Pressable onPress={() => setSelectedReason(reason.value)}>
                <HStack className="py-15 items-center" gap={10}>
                  <Radio
                    isChecked={selectedReason === reason.value}
                    onChange={() => setSelectedReason(reason.value)}
                  />
                  <Typography className="text-black text-14 font-normal">{reason.label}</Typography>
                </HStack>
              </Pressable>
              {ix !== WITHDRAWAL_REASONS.length - 1 && <View className="h-[1px] bg-gray2" />}
            </View>
          ))}
        </VStack>
      </VStack>
      <WithdrawalBottomAction
        onPressNext={handlePressNext}
        onPressContinue={handlePressBack}
        isNextEnabled={!!selectedReason}
      />
    </View>
  );
}
