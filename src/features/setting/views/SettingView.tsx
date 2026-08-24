import { useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import defaultProfileImage from "@/common/assets/common/profile-default.png";
import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Toggle from "@/common/components/Toggle/Toggle";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useGlobalLoading } from "@/common/hooks/useGlobalLoading";
import { useModal } from "@/common/providers/ModalProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useUploadImagesMutation } from "@/common/queries/useUploadImagesMutation";
import { SETTINGS_ROUTES, useMypageNavigation, useSettingsNavigation } from "@/common/router";
import { HOME_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import { useLogin } from "@/features/auth/hooks/useLogin";
import ProfileImageSelectButton from "@/features/setting/components/ProfileImageSelectButton/ProfileImageSelectButton";
import { useGetNotificationSettings } from "@/features/setting/hooks/useGetNotificationSettings";
import { useUpdateNotificationSettings } from "@/features/setting/hooks/useUpdateNotificationSettings";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";

/**
 * C15 설정 — 프로필(사진 변경) · 계정 · 알림 설정 · 로그아웃/회원 탈퇴를 5px 밴드로 끊는다.
 *
 * 알림 설정은 별도 화면으로 빼지 않고 여기서 바로 토글한다. 항목이 둘뿐이라 화면을 하나 더
 * 만들면 이동이 늘 뿐이고, 켜고 끄는 일은 그 자리에서 끝나는 게 자연스럽다.
 *
 * [회원 탈퇴]는 14/400 회색으로 한 단계 낮췄다 — 설정을 훑는 사람의 시선에 걸릴 이유가 없다.
 */
const NOTIFICATION_ITEMS = [
  {
    key: "followPostPushAgree" as const,
    label: "팔로우 쇼룸 새 게시물 알림",
    description: "팔로우한 쇼룸이 새 공구나 게시물을 올리면 알려드려요",
  },
  {
    key: "marketingAgree" as const,
    label: "광고성 정보 수신 동의",
    description: "혜택·이벤트 소식을 받아요",
  },
];

export default function SettingView() {
  const mypageNavigation = useMypageNavigation();
  const settingsNavigation = useSettingsNavigation();
  const { navigate } = useBottomTab();
  const { show: showModal } = useModal();
  const { user } = useUserStore();
  const { logout } = useLogin();

  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImagesMutation();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  const { data: notificationSettings } = useGetNotificationSettings();
  const { updateDebounced: updateNotification } = useUpdateNotificationSettings();

  useGlobalLoading({ condition: isUploading || isUpdating });

  const handleLogout = useCallback(async () => {
    await logout();
    mypageNavigation.goBack();
    setTimeout(() => {
      navigate(HOME_ROUTES.HOME);
    }, 500);
    toast.show("로그아웃 되었습니다.");
  }, [logout, mypageNavigation, navigate]);

  const handlePressLogout = useCallback(() => {
    showModal({
      title: "로그아웃 하시겠어요?",
      message: "로그아웃해도 쇼룸과 게시물은 계속 볼 수 있어요",
      buttons: [
        // 계정을 떠나는 액션이라 머무르는 [취소]가 로즈·우측이다
        { label: "로그아웃", variant: "outline", onPress: handleLogout },
        { label: "취소" },
      ],
    });
  }, [handleLogout, showModal]);

  const handleSelectProfileImage = useCallback(
    async (imageUrl: string) => {
      if (!user) {
        return;
      }
      try {
        const uploadedUrls = await uploadImages({ localUris: [imageUrl], type: "PROFILE" });

        await updateUser({
          profileImageUrl: uploadedUrls[0],
          birthday: user.birthday,
          gender: user.gender,
          marketingAgree: user.marketingAgree,
          nickname: user.nickname,
          phoneNumber: user.phoneNumber,
        });
        toast.show("프로필 이미지가 변경되었습니다.");
      } catch {
        toast.show("프로필 이미지 변경에 실패했어요");
      }
    },
    [updateUser, uploadImages, user]
  );

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="설정" onPressBack={mypageNavigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center px-14 pb-22 pt-24">
          <ProfileImageSelectButton onSelect={handleSelectProfileImage}>
            <View>
              <Image
                source={user.profileImageUrl ? { uri: user.profileImageUrl } : defaultProfileImage}
                className="h-76 w-76 rounded-full"
              />
              {/* 사진을 바꿀 수 있다는 신호 — 안내 문구만으로는 탭 대상임이 드러나지 않는다 */}
              <View
                className="absolute items-center justify-center rounded-full border-[1px] border-borderButton bg-white"
                style={{ right: -2, bottom: -2, width: 26, height: 26 }}
              >
                <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4.5 8.5h3l1.6-2h5.8l1.6 2h3v10h-15z"
                    stroke="#3C3C3C"
                    strokeWidth={1.8}
                    strokeLinejoin="miter"
                  />
                  <Circle cx={12} cy={13} r={3} stroke="#3C3C3C" strokeWidth={1.8} />
                </Svg>
              </View>
            </View>
          </ProfileImageSelectButton>

          <Typography
            style={{ fontSize: 17, fontWeight: "700", lineHeight: 22.1, letterSpacing: -0.3, marginTop: 12 }}
            className="text-ink"
          >
            {user.nickname}
          </Typography>
          <Typography style={{ fontSize: 12.5, lineHeight: 12.5, marginTop: 5 }} className="text-gray45">
            프로필 사진을 탭해 변경할 수 있어요
          </Typography>
        </View>

        <GroupBand height={5} />

        <SectionLabel label="계정" className="pb-6 pt-18" />
        <SettingRow
          label="닉네임 변경"
          onPress={() => settingsNavigation.navigate(SETTINGS_ROUTES.NICKNAME_CHANGE)}
        />
        <SettingRow
          label="회원정보"
          onPress={() => settingsNavigation.navigate(SETTINGS_ROUTES.MEMBER_INFO_CHANGE)}
        />

        <View className="mt-10">
          <GroupBand height={5} />
        </View>

        <SectionLabel label="알림 설정" className="pb-6 pt-18" />
        {NOTIFICATION_ITEMS.map(item => (
          <View key={item.key} className="flex-row items-center p-14" style={{ gap: 12 }}>
            <View className="min-w-0 flex-1">
              <Typography style={{ fontSize: 15, fontWeight: "500", lineHeight: 21 }} className="text-ink">
                {item.label}
              </Typography>
              <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 4 }} className="text-gray45">
                {item.description}
              </Typography>
            </View>
            <Toggle
              value={notificationSettings?.[item.key] ?? false}
              onChange={next => updateNotification(item.key, next)}
            />
          </View>
        ))}
        <Typography style={{ fontSize: 12, lineHeight: 20.4 }} className="px-14 pt-13 text-gray45">
          주문·배송·문의 답변 등 거래 알림은 끌 수 없어요
        </Typography>

        <View className="mt-18">
          <GroupBand height={5} />
        </View>

        <SettingRow label="로그아웃" onPress={handlePressLogout} className="py-16" />
        <SettingRow
          label="회원 탈퇴"
          onPress={() => settingsNavigation.navigate(SETTINGS_ROUTES.WITHDRAWAL)}
          isPassive
          className="py-16"
        />

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}

interface SettingRowProps {
  label: string;
  onPress: () => void;
  /** 회원 탈퇴처럼 눈에 덜 띄어야 하는 항목 — 14/400 회색 */
  isPassive?: boolean;
  className?: string;
}

function SettingRow(props: SettingRowProps) {
  const { label, onPress, isPassive = false, className = "py-15" } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`flex-row items-center justify-between px-14 ${className}`}
    >
      <Typography
        style={{ fontSize: 14, fontWeight: isPassive ? "400" : "500", lineHeight: 14 }}
        className={isPassive ? "text-gray45" : "text-ink"}
      >
        {label}
      </Typography>
      <ChevronRightIcon size={16} />
    </TouchableOpacity>
  );
}
