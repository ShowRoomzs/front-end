import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useSettingsNavigation } from "@/common/router";
import { useGetAccountInfo, useReverifyIdentityMutation } from "@/features/setting/hooks/useAccountInfo";

/**
 * C15-2 회원정보 — 조회 전용 + 재인증 갱신.
 *
 * 값을 직접 고치는 폼이 아니다. 이름·생년월일·휴대폰번호는 본인인증으로 확인된 정보라
 * 사용자가 손으로 바꿀 수 있게 두면 오히려 신뢰도가 떨어진다 — 번호가 바뀌었으면 다시 인증해서
 * 최신 정보로 덮는다.
 *
 * 조회 값에는 셰브런을 붙이지 않았다. 탭해도 아무 일 없는 행을 만들지 않기 위해서다.
 * 라벨은 회색, 값은 굵게 두어 왼쪽에서 라벨, 오른쪽에서 값을 훑을 수 있게 했다.
 *
 * 동의 체크와 버튼은 하단 고정 영역에 함께 둔다 — 스크롤과 무관하게 항상 보이고,
 * 체크 → 버튼이 한 엄지 안에 들어온다.
 */
export default function MemberInfoChangeView() {
  const navigation = useSettingsNavigation();
  const { bottom } = useSafeAreaInsets();
  const [agreeConsent, setAgreeConsent] = useState(false);

  const { data: accountInfo, isLoading } = useGetAccountInfo();
  const { mutateAsync: reverify, isPending } = useReverifyIdentityMutation();

  const canVerify = agreeConsent && !isPending;

  const handleReverify = useCallback(async () => {
    if (!canVerify) {
      return;
    }
    try {
      await reverify(true);
      setAgreeConsent(false);
      toast.show("회원정보가 최신 정보로 갱신되었어요");
    } catch {
      toast.show("본인인증에 실패했어요. 잠시 후 다시 시도해 주세요");
    }
  }, [canVerify, reverify]);

  const rows = [
    { label: "이름", value: accountInfo?.name },
    { label: "생년월일", value: accountInfo?.birthday },
    { label: "휴대폰번호", value: accountInfo?.phoneNumber },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="회원정보" onPressBack={navigation.goBack} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <SectionLabel label="계정" className="pb-6 pt-20" />
          {rows.map(row => (
            <View key={row.label} className="flex-row items-center justify-between p-14" style={{ gap: 12 }}>
              <Typography style={{ fontSize: 14.5, lineHeight: 14.5 }} className="text-gray45">
                {row.label}
              </Typography>
              <Typography
                style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 14.5 }}
                className="text-right text-ink"
              >
                {row.value ?? "-"}
              </Typography>
            </View>
          ))}

          <View className="mt-10">
            <GroupBand height={5} />
          </View>

          <View className="px-14 pt-20">
            <Typography variant="sectionLabel" className="text-gray55">
              회원정보 변경
            </Typography>
            <Typography style={{ fontSize: 12.5, lineHeight: 21.25, marginTop: 10 }} className="text-gray45">
              이름·생년월일·휴대폰번호는 본인인증으로 확인된 정보라 직접 수정할 수 없어요. 번호가 바뀌었거나
              정보가 다르면 다시 인증해 최신 정보로 업데이트할 수 있어요.
            </Typography>
          </View>

          <View className="h-20" />
        </ScrollView>
      )}

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-14"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={() => setAgreeConsent(prev => !prev)}
          activeOpacity={0.6}
          className="flex-row items-start pb-14"
          style={{ gap: 10 }}
        >
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 21,
              height: 21,
              marginTop: 1,
              borderWidth: 1.5,
              borderColor: agreeConsent ? "#F2456E" : "#DEDEE0",
              backgroundColor: agreeConsent ? "#F2456E" : "#FFFFFF",
            }}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4.5 12.5l5 5 10-11"
                stroke={agreeConsent ? "#FFFFFF" : "#DEDEE0"}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="min-w-0 flex-1 text-ink76">
            <Typography style={{ fontWeight: "600" }} className="text-roseText">
              [필수]
            </Typography>{" "}
            본인확인을 위해 이름·생년월일·성별·휴대폰번호를 수집·이용하는 데 동의합니다
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReverify}
          disabled={!canVerify}
          activeOpacity={0.75}
          className={`h-52 flex-row items-center justify-center rounded-base ${
            canVerify ? "bg-rose" : "bg-fill"
          }`}
        >
          <Typography variant="buttonPrimary" className={canVerify ? "text-white" : "text-gray71"}>
            PASS로 다시 인증하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
