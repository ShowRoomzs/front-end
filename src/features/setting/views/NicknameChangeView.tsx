import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useSettingsNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import NicknameField from "@/features/user/components/NicknameField/NicknameField";
import { useNicknameCheck } from "@/features/user/hooks/useNicknameCheck";
import { useUpdateUserMutation } from "@/features/user/hooks/useUpdateUserMutation";

/**
 * C15-1 닉네임 변경 — 가입(C0-1)과 같은 규칙·문구·색을 쓴다.
 *
 * 가입과 다른 점은 [저장] 버튼의 활성 조건이다. 검증을 통과해야 로즈로 켜지고,
 * **현재 닉네임 그대로**이거나 오류 상태면 계속 비활성이다 — 아무것도 바뀌지 않는 저장을
 * 눌러 보게 만들 이유가 없다.
 */
export default function NicknameChangeView() {
  const navigation = useSettingsNavigation();
  const { bottom } = useSafeAreaInsets();
  const { user } = useUserStore();
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const { isAvailable, isError, message } = useNicknameCheck(nickname === user?.nickname ? "" : nickname);

  const isUnchanged = nickname.trim() === (user?.nickname ?? "");
  const canSave = isAvailable && !isUnchanged && !isPending;

  const handleSave = useCallback(async () => {
    if (!user || !canSave) {
      return;
    }
    try {
      await updateUser({
        nickname: nickname.trim(),
        profileImageUrl: user.profileImageUrl,
        birthday: user.birthday,
        gender: user.gender,
        marketingAgree: user.marketingAgree,
        phoneNumber: user.phoneNumber,
      });
      toast.show("닉네임이 변경되었어요");
      navigation.goBack();
    } catch {
      toast.show("닉네임 변경에 실패했어요. 잠시 후 다시 시도해 주세요");
    }
  }, [canSave, navigation, nickname, updateUser, user]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="닉네임 변경" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="px-14 pb-4 pt-22">
          <NicknameField
            value={nickname}
            onChangeText={setNickname}
            isError={isError}
            isAvailable={isAvailable}
            message={message}
            placeholder="새 닉네임을 입력해 주세요"
            autoFocus
          />
        </View>
      </ScrollView>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.75}
          className={`h-52 flex-row items-center justify-center rounded-base ${
            canSave ? "bg-rose" : "bg-fill"
          }`}
        >
          <Typography variant="buttonPrimary" className={canSave ? "text-white" : "text-gray71"}>
            저장
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
