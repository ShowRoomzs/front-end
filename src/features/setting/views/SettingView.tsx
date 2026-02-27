import { useCallback, useMemo } from "react";
import { Image, Pressable, View } from "react-native";

import defaultProfileImage from "@/common/assets/common/profile-default.png";
import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useGlobalLoading } from "@/common/hooks/useGlobalLoading";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { SETTINGS_ROUTES, useMypageNavigation, useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import ProfileImageSelectButton from "@/features/setting/components/ProfileImageSelectButton/ProfileImageSelectButton";
import SettingsHeader from "@/features/setting/components/SettingsHeader/SettingsHeader";
import { SETTING_MENUS } from "@/features/setting/constants/menus";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";
import { UpdateUserRequest } from "@/features/user/types/user";

export default function SettingView() {
  const mypageNavigation = useMypageNavigation();
  const settingsNavigation = useSettingsNavigation();
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  useGlobalLoading({
    condition: isUploading || isUpdating,
  });
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

  const handlePressNicknameChange = useCallback(() => {
    settingsNavigation.navigate(SETTINGS_ROUTES.NICKNAME_CHANGE);
  }, [settingsNavigation]);

  const handleSelectProfileImage = useCallback(
    async (imageUrl: string) => {
      try {
        if (!user) {
          return;
        }

        const uploadedUrls = await uploadImages({ localUris: [imageUrl], type: "PROFILE" });
        const userData: UpdateUserRequest = {
          profileImageUrl: uploadedUrls[0],
          birthday: user.birthday,
          gender: user.gender,
          marketingAgree: user.marketingAgree,
          nickname: user.nickname,
          phoneNumber: user.phoneNumber,
        };

        await updateUser(userData);
        toast.show("프로필 이미지가 변경되었습니다.");
      } catch (error) {
        console.error(error);
      }
    },
    [updateUser, uploadImages, user]
  );

  if (!user) {
    return null;
  }

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
            <Button
              onPress={handlePressNicknameChange}
              className="flex-1"
              size="md"
              variant="secondary-black"
            >
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
