import { useCallback, useMemo } from "react";
import { Image, Pressable, View } from "react-native";

import defaultProfileImage from "@/common/assets/common/profile-default.png";
import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { useMypageNavigation, useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import ProfileImageSelectButton from "@/features/setting/components/ProfileImageSelectButton/ProfileImageSelectButton";
import SettingsHeader from "@/features/setting/components/SettingsHeader/SettingsHeader";
import { SETTING_MENUS } from "@/features/setting/constants/menus";

export default function SettingView() {
  const mypageNavigation = useMypageNavigation();
  const settingsNavigation = useSettingsNavigation();
  const { mutateAsync: uploadImages, isPending: _isUploading } = useUploadImagesMutation();

  const { user } = useUserStore();

  const handlePressBack = useCallback(() => {
    mypageNavigation.goBack();
  }, [mypageNavigation]);

  const settingMenus = useMemo(
    () =>
      SETTING_MENUS.map(menu => ({
        ...menu,
        onPress: () => {
          if (menu.key === "logout") {
            console.log("logout"); // TODO : 로그아웃 처리
            return;
          }
          if (menu.routeName) {
            settingsNavigation.navigate(menu.routeName);
          }
        },
      })),
    [settingsNavigation]
  );

  const handleSelectProfileImage = useCallback(
    async (imageUrl: string) => {
      try {
        const uploadedUrls = await uploadImages({ localUris: [imageUrl], type: "PROFILE" });
        // TODO 유저 정보 업데이트

        console.log(uploadedUrls);
      } catch (error) {
        console.error(error);
      }
    },
    [uploadImages]
  );

  if (!user) {
    return null;
  }

  // TODO : 스피너 표출
  return (
    <View className="flex-1">
      <SettingsHeader wrapperClassName="px-20" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={25}>
        <View className="flex flex-col" style={{ gap: 15 }}>
          <HStack className="items-center" gap={10}>
            <Image
              source={user.profileImageUrl ? { uri: user.profileImageUrl } : defaultProfileImage}
              className="w-40 h-40 rounded-full"
            />
            <Typography className="text-black text-16 font-semibold">{user.nickname}</Typography>
          </HStack>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ProfileImageSelectButton onSelect={handleSelectProfileImage} />
            <Button className="flex-1" size="md" variant="secondary-black">
              닉네임 변경
            </Button>
          </View>
        </View>
        <VStack>
          {settingMenus.map((menu, ix) => (
            <Pressable
              onPress={menu.onPress}
              key={menu.key}
              className={cn(
                "flex flex-row justify-between items-center py-15 border-gray2",
                ix !== settingMenus.length - 1 && "border-b-[1px]"
              )}
            >
              <Typography className="text-black text-14 font-medium">{menu.title}</Typography>
              <Icon icon={COMMON_ASSETS.arrowRight} />
            </Pressable>
          ))}
        </VStack>
      </VStack>
    </View>
  );
}
