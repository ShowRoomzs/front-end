import { useEffect } from "react";
import { View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Input from "@/common/components/Input/Input";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useSettingsNavigation } from "@/common/router";
import { COMMON_ASSETS } from "@/common/utils/assets";
import RefundAccountBottomAction from "@/features/setting/components/RefundAccountBottomAction/RefundAccountBottomAction";
import SettingsHeader from "@/features/setting/components/SettingsHeader/SettingsHeader";

export default function RefundAccountView() {
  const settingsNavigation = useSettingsNavigation();
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
      <SettingsHeader title="환불 계좌" wrapperClassName="px-20" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={20}>
        <LabeledComponent label="은행 선택">
          <View className="flex-row justify-between items-center border-[1px] border-gray3 rounded-[5px] px-15 py-15">
            <Typography className="text-gray9 text-14 font-normal">은행을 선택해 주세요</Typography>
            <Icon icon={COMMON_ASSETS.arrowDown} />
          </View>
        </LabeledComponent>
        <LabeledComponent label="계좌번호">
          <Input readOnly placeholder="계좌번호를 입력해 주세요" />
        </LabeledComponent>
      </VStack>
      <View className="h-10 bg-gray1 mt-25" />
      <VStack className="px-20 pt-25" gap={8}>
        <Typography className="text-black text-13 font-medium">유의사항</Typography>
        <View className="bg-gray1 border-[1px] border-gray2 rounded-[5px] p-15">
          <Typography className="text-14 font-normal" style={{ color: "#646466" }}>
            추가하실 환불 계좌정보를 상세하게 확인하신 후 추가해주시기 바랍니다
          </Typography>
        </View>
      </VStack>
      <RefundAccountBottomAction />
    </View>
  );
}
