import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import LabeledInput from "@/common/components/LabeledInput/LabeledInput";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useGlobalLoading } from "@/common/hooks/useGlobalLoading";
import { useInputValidation } from "@/common/hooks/useInputValidation";
import { toast } from "@/common/providers/ToastProvider";
import { useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { NICKNAME_MAX_LENGTH, NICKNAME_VALIDATION_RULES } from "@/features/auth/constants/validation";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";
import { UpdateUserRequest } from "@/features/user/types/user";

export default function NicknameChangeView() {
  const settingsNavigation = useSettingsNavigation();
  const { user } = useUserStore();
  const insets = useSafeAreaInsets();
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
      settingsNavigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <Header
        centered
        title="닉네임 변경"
        className="px-20 py-10 border-b-[1px] border-gray2"
        renderLeft={
          <TouchableOpacity onPress={handlePressBack} activeOpacity={0.7}>
            <Icon icon={COMMON_ASSETS.back} />
          </TouchableOpacity>
        }
      />
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
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-gray2 bg-white px-10 pt-10"
        style={{ paddingBottom: insets.bottom }}
      >
        <Button size="xl" variant="primary" onPress={handleSubmit} disabled={!isValid || !isNicknameChanged}>
          변경하기
        </Button>
      </View>
    </View>
  );
}
