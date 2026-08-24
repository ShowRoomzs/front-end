import { useCallback, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { SETTINGS_ROUTES, useSettingsNavigation } from "@/common/router";
import { useGetWithdrawalInfo } from "@/features/setting/hooks/useWithdrawal";
import { WithdrawalReasonCode } from "@/features/setting/types/withdrawal";

/**
 * C15-3 회원 탈퇴 1단계 — 이유 선택.
 *
 * 이유를 먼저 묻는다. 무거운 고지(삭제되는 것들)를 먼저 보이면 읽지 않고 넘기게 되고,
 * 이유는 **결심이 굳기 전**에 물어야 솔직한 답이 나온다.
 *
 * 하단은 [다음 단계로](좌·중립 외곽선)와 [계속 사용하기](우·로즈)다 — 오른손 엄지가 닿는
 * 우측을 머무르는 선택에 둔다. 이유는 선택 사항이지만, 고르지 않으면 [다음 단계로]가
 * 활성화되지 않아 한 번은 눈으로 훑게 된다.
 */
const CUSTOM_REASON_MAX_LENGTH = 200;

export default function WithdrawalView() {
  const navigation = useSettingsNavigation();
  const { bottom } = useSafeAreaInsets();
  const { data: info, isLoading } = useGetWithdrawalInfo();

  const [reason, setReason] = useState<WithdrawalReasonCode | null>(null);
  const [customReason, setCustomReason] = useState("");

  const handleNext = useCallback(() => {
    if (!reason) {
      return;
    }
    navigation.navigate(SETTINGS_ROUTES.WITHDRAWAL_CONFIRM, {
      reason,
      customReason: reason === "ETC" ? customReason.trim() : null,
    });
  }, [customReason, navigation, reason]);

  if (isLoading || !info) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="회원 탈퇴" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="회원 탈퇴" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="px-14 pb-6 pt-22">
          <Typography
            style={{ fontSize: 18, fontWeight: "700", lineHeight: 27, letterSpacing: -0.5 }}
            className="text-ink"
          >
            {"더 나았던 이유를\n알려주실 수 있나요?"}
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 9 }} className="text-gray45">
            서비스 개선에만 사용하고 계정 정보와 분리해 보관합니다 · 선택하지 않아도 탈퇴할 수 있어요
          </Typography>
        </View>

        <View className="px-14 pt-16" style={{ gap: 8 }}>
          {info.reasons.map(option => {
            const isSelected = reason === option.code;

            return (
              <TouchableOpacity
                key={option.code}
                onPress={() => setReason(isSelected ? null : option.code)}
                activeOpacity={0.6}
                className="flex-row items-center rounded-base px-13 py-11"
                style={{
                  gap: 10,
                  minHeight: 46,
                  borderWidth: 1,
                  borderColor: isSelected ? "#F2456E" : "#E3E3E5",
                  backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
                }}
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 19,
                    height: 19,
                    borderWidth: 1.5,
                    borderColor: isSelected ? "#F2456E" : "#DEDEE0",
                    backgroundColor: isSelected ? "#F2456E" : "#FFFFFF",
                  }}
                >
                  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M4.5 12.5l5 5 10-11"
                      stroke={isSelected ? "#FFFFFF" : "#DEDEE0"}
                      strokeWidth={3.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Typography
                  style={{ fontSize: 13.5, fontWeight: isSelected ? "600" : "400", lineHeight: 19.6 }}
                  className={isSelected ? "text-[#CF3D61]" : "text-ink76"}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {reason === "ETC" && (
          <View className="px-14 pt-12">
            <View className="rounded-base border-[1px] border-borderButton p-13" style={{ minHeight: 88 }}>
              <TextInput
                value={customReason}
                onChangeText={setCustomReason}
                placeholder="어떤 점이 아쉬웠는지 알려주세요 (선택)"
                placeholderTextColor="#B5B5B5"
                maxLength={CUSTOM_REASON_MAX_LENGTH}
                multiline
                className="m-0 p-0 text-13.5 text-ink"
                style={{ fontSize: 13.5, lineHeight: 21.6, textAlignVertical: "top" }}
              />
            </View>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      <View
        className="flex-row border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ gap: 8, paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handleNext}
          disabled={!reason}
          activeOpacity={0.6}
          className="h-52 flex-1 flex-row items-center justify-center rounded-base"
          style={{
            borderWidth: 1,
            borderColor: reason ? "#DCDCDE" : "transparent",
            backgroundColor: reason ? "#FFFFFF" : "#F4F4F5",
          }}
        >
          <Typography variant="buttonPrimary" className={reason ? "text-ink76" : "text-gray71"}>
            다음 단계로
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigation.goBack}
          activeOpacity={0.75}
          className="h-52 flex-1 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            계속 사용하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
