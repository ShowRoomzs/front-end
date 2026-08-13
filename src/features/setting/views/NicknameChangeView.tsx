import { useEffect, useState } from "react";
import { View } from "react-native";

import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useGlobalLoading } from "@/common/hooks/useGlobalLoading";
import { useInputValidation } from "@/common/hooks/useInputValidation";
import { toast } from "@/common/providers/ToastProvider";
import { useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { NICKNAME_MAX_LENGTH, NICKNAME_VALIDATION_RULES } from "@/features/auth/constants/validation";
import NicknameChangeBottomAction from "@/features/setting/components/NicknameChangeBottomAction/NicknameChangeBottomAction";
import SettingsHeader from "@/features/setting/components/SettingsHeader/SettingsHeader";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";
import { UpdateUserRequest } from "@/features/user/types/user";

export default function NicknameChangeView() {
  const settingsNavigation = useSettingsNavigation();
  const { user } = useUserStore();
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();
  const { hide, show } = useBottomTab();

  useGlobalLoading({ condition: isPending });

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const isNicknameChanged = nickname !== user?.nickname;
  const { status, helperText, isValid } = useInputValidation(
    nickname,
    NICKNAME_VALIDATION_RULES,
    isNicknameChanged
  );

  if (!user) {
    return null;
  }

  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  const handleSubmit = async () => {
    if (!isValid) {
      return;
    }

    const userData: UpdateUserRequest = {
      nickname,
      birthday: user.birthday,
      gender: user.gender,
      marketingAgree: user.marketingAgree,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
    };

    try {
      await updateUser(userData);
      toast.show("닉네임이 변경되었습니다.");
      setTimeout(() => {
        settingsNavigation.goBack();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <SettingsHeader title="닉네임 변경" wrapperClassName="px-20" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={20}>
        <LabeledInput
          label="닉네임"
          placeholder="닉네임을 입력해주세요 (최대 10글자)"
          value={nickname}
          onChangeText={setNickname}
          maxLength={NICKNAME_MAX_LENGTH}
          status={status}
          helperText={helperText}
        />
      </VStack>
      <NicknameChangeBottomAction onPress={handleSubmit} disabled={!isValid || !isNicknameChanged} />
    </View>
  );
}
