import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useSettingsNavigation } from "@/common/router";
import { cn } from "@/common/utils/cn";
import SettingsHeader from "@/features/setting/components/SettingsHeader/SettingsHeader";
import WithdrawalBottomAction from "@/features/setting/components/WithdrawalBottomAction/WithdrawalBottomAction";

const WITHDRAWAL_REASONS = ["앱 사용이 불편해요", "상품 탐색이 어려워요"];

export default function WithdrawalView() {
  const settingsNavigation = useSettingsNavigation();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { hide, show } = useBottomTab();
  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  return (
    <View className="flex-1">
      <SettingsHeader title="회원탈퇴" wrapperClassName="px-20" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={35}>
        <Typography className="text-black text-20 font-semibold">탈퇴하는 사유를 선택해 주세요</Typography>
        <VStack gap={0}>
          {WITHDRAWAL_REASONS.map((reason, ix) => (
            <View key={reason}>
              <Pressable onPress={() => setSelectedReason(reason)}>
                <HStack className="py-15 items-center" gap={10}>
                  <View
                    className={cn(
                      "w-24 h-24 rounded-full border-2 items-center justify-center",
                      selectedReason === reason ? "border-black" : "border-gray3"
                    )}
                  >
                    {selectedReason === reason && <View className="w-12 h-12 rounded-full bg-black" />}
                  </View>
                  <Typography className="text-black text-14 font-normal">{reason}</Typography>
                </HStack>
              </Pressable>
              {ix !== WITHDRAWAL_REASONS.length - 1 && <View className="h-[1px] bg-gray2" />}
            </View>
          ))}
        </VStack>
      </VStack>
      <WithdrawalBottomAction onPressContinue={handlePressBack} isNextEnabled={!!selectedReason} />
    </View>
  );
}
