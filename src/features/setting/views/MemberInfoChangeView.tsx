import { useEffect } from "react";
import { View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { cn } from "@/common/utils/cn";
import MemberInfoChangeBottomAction from "@/features/setting/components/MemberInfoChangeBottomAction/MemberInfoChangeBottomAction";
import { User } from "@/features/user/types/user";

const INFO_ITEMS: Array<{ label: string; key: keyof User; formatter?: (value: string) => string }> = [
  { label: "이름", key: "nickname" },
  { label: "생년월일", key: "birthday", formatter: (value: string) => value.replaceAll("-", ".") },
  { label: "휴대폰 번호", key: "phoneNumber" },
];

export default function MemberInfoChangeView() {
  const settingsNavigation = useSettingsNavigation();
  const { hide, show } = useBottomTab();
  const { user } = useUserStore();

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  if (!user) {
    return null;
  }

  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  return (
    <View className="flex-1">
      <ScreenHeader title="회원 정보" onPressBack={handlePressBack} />
      <View className="px-20 pt-25">
        {INFO_ITEMS.map((item, ix) => {
          const value = user[item.key] ? user[item.key].toString() : "";
          const formattedValue = item.formatter ? item.formatter(value) : value;

          return (
            <HStack
              key={item.key}
              className={cn(
                "py-15 justify-between items-center",
                ix !== INFO_ITEMS.length - 1 && "border-b-[1px] border-gray2"
              )}
            >
              <Typography className="text-gray9 text-14 font-normal">{item.label}</Typography>
              <Typography className="text-black text-14 font-medium">{formattedValue}</Typography>
            </HStack>
          );
        })}
      </View>
      <MemberInfoChangeBottomAction />
    </View>
  );
}
