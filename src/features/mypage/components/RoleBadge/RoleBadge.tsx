import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 역할 칩 — 닉네임 아랫줄의 배지(R8 · 11/600, 배지 규격 동일).
 *
 * 라벨은 **영문 그대로** 둔다 — 한글로 옮기면 "일반 회원"이 등급처럼 읽히고, 두 배지의
 * 글자 폭이 크게 달라져 닉네임 아랫줄의 리듬이 깨진다.
 *
 * USER는 중립 회색, INFLUENCER는 바이올렛→핑크로 아주 옅게 흐르는 틴트 그라디언트 위에
 * 바이올렛 텍스트(#6B48CC)다. 로즈와 겹치지 않아 공구 신호를 침범하지 않으면서
 * 배지 규격 안에 머문다.
 */
interface RoleBadgeProps {
  roleType?: string;
}

const INFLUENCER_TINT = ["#E4DAFB", "#F7DDEE", "#FCDDE6"] as const;

export default function RoleBadge(props: RoleBadgeProps) {
  const { roleType } = props;

  const isInfluencer = roleType === "INFLUENCER" || roleType === "CREATOR";

  if (!isInfluencer) {
    return (
      <View className="self-start rounded-base bg-fill px-9 py-4">
        <Typography variant="badge" style={{ letterSpacing: 0.3 }} className="text-gray45">
          USER
        </Typography>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={INFLUENCER_TINT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 }}
    >
      <Typography variant="badge" style={{ color: "#6B48CC", letterSpacing: 0.3 }}>
        INFLUENCER
      </Typography>
    </LinearGradient>
  );
}
