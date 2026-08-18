import { useCallback, useMemo } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import defaultProfileImage from "@/common/assets/common/profile-default.png";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import HStack from "@/common/components/HStack/HStack";
import MenuGroup, { MenuItem } from "@/common/components/MenuGroup/MenuGroup";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useGlobalLoading } from "@/common/hooks/useGlobalLoading";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { SETTINGS_ROUTES, useMypageNavigation, useSettingsNavigation } from "@/common/router";
import { HOME_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import { useLogin } from "@/features/auth/hooks/useLogin";
import ProfileImageSelectButton from "@/features/setting/components/ProfileImageSelectButton/ProfileImageSelectButton";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";
import { UpdateUserRequest } from "@/features/user/types/user";

export default function SettingView() {
  const mypageNavigation = useMypageNavigation();
  const { navigate } = useBottomTab();
  const settingsNavigation = useSettingsNavigation();
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  useGlobalLoading({
    condition: isUploading || isUpdating,
  });
  const { user } = useUserStore();
  const { logout } = useLogin();

  const handleLogout = useCallback(async () => {
    await logout();
    mypageNavigation.goBack();
    setTimeout(() => {
      navigate(HOME_ROUTES.HOME);
    }, 500);
    toast.show("로그아웃 되었습니다.");
  }, [logout, mypageNavigation, navigate]);

  const handlePressBack = useCallback(() => {
    mypageNavigation.goBack();
  }, [mypageNavigation]);

  const accountItems = useMemo(
    (): Array<MenuItem> => [
      {
        key: "memberInfoChange",
        label: "회원 정보 변경",
        onPress: () => settingsNavigation.navigate(SETTINGS_ROUTES.MEMBER_INFO_CHANGE),
      },
      {
        key: "refundAccount",
        label: "환불 계좌 관리",
        onPress: () => settingsNavigation.navigate(SETTINGS_ROUTES.REFUND_ACCOUNT),
      },
    ],
    [settingsNavigation]
  );

  const notificationItems = useMemo(
    (): Array<MenuItem> => [
      {
        key: "notificationSettings",
        label: "알림 설정",
        onPress: () => settingsNavigation.navigate(SETTINGS_ROUTES.NOTIFICATION_SETTINGS),
      },
    ],
    [settingsNavigation]
  );

  // 로그아웃과 탈퇴는 계정을 떠나는 액션이라 한 그룹으로 묶어 맨 아래에 둔다
  const accountManageItems = useMemo(
    (): Array<MenuItem> => [
      { key: "logout", label: "로그아웃", isPassive: true, onPress: handleLogout },
      {
        key: "withdrawal",
        label: "회원 탈퇴",
        isPassive: true,
        onPress: () => settingsNavigation.navigate(SETTINGS_ROUTES.WITHDRAWAL),
      },
    ],
    [handleLogout, settingsNavigation]
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
    <View className="flex-1 bg-white">
      <ScreenHeader title="설정" onPressBack={handlePressBack} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14 pb-20 pt-18" style={{ gap: 15 }}>
          <HStack className="items-center" gap={12}>
            <Image
              source={user.profileImageUrl ? { uri: user.profileImageUrl } : defaultProfileImage}
              className="h-50 w-50 rounded-full"
            />
            <Typography variant="profileNameSmall" className="text-ink">
              {user.nickname}
            </Typography>
          </HStack>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ProfileImageSelectButton onSelect={handleSelectProfileImage} />
            <TouchableOpacity
              onPress={handlePressNicknameChange}
              activeOpacity={0.6}
              className="h-44 flex-1 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
            >
              <Typography variant="buttonInline" className="text-ink76">
                닉네임 변경
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <GroupBand />
        <MenuGroup title="계정" items={accountItems} />
        <GroupBand />
        <MenuGroup title="알림" items={notificationItems} />
        <GroupBand />
        <MenuGroup title="계정 관리" items={accountManageItems} />
      </ScrollView>
    </View>
  );
}
