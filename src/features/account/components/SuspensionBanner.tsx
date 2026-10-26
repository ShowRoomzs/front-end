import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { SUSPENSION_SHEET_ID } from "@/features/account/constants/suspension";
import { useSuspension } from "@/features/account/hooks/useAccountStatus";

/**
 * C20 1a 정지 배너 — 헤더 바로 아래 고정, 닫기 없음.
 *
 * 위험 톤(#FDECEC / #B42318 · 대비 5.6:1)이다. **로즈를 쓰지 않는다** — 로즈는 공구 · 권장 액션 신호라
 * 정지와 섞이면 의미가 무너진다. 사유는 운영자가 고른 정형 사유 그대로(상세 사유는 내리지 않는다).
 * 옛 회원처럼 사유가 없으면 사유 부분을 빼고 그린다.
 */
export default function SuspensionBanner() {
  const suspension = useSuspension();
  const { open } = useBottomSheetContext();

  if (!suspension) {
    return null;
  }
  return (
    <View
      className="flex-row items-center"
      style={{
        gap: 10,
        minHeight: 44,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#FDECEC",
      }}
    >
      <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={8.5} stroke="#B42318" strokeWidth={1.7} />
        <Path d="M12 7.6v5.2" stroke="#B42318" strokeWidth={2} strokeLinecap="round" />
        <Path d="M12 16.3v.2" stroke="#B42318" strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Typography
        style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 18.1, color: "#B42318" }}
        className="min-w-0 flex-1"
      >
        {suspension.reasonLabel
          ? `계정 이용이 정지되었어요 · 사유: ${suspension.reasonLabel}`
          : "계정 이용이 정지되었어요"}
      </Typography>
      <TouchableOpacity
        onPress={() => open(SUSPENSION_SHEET_ID)}
        activeOpacity={0.6}
        style={{ paddingVertical: 12, paddingLeft: 8, marginVertical: -12 }}
      >
        <Typography
          style={{
            fontSize: 12.5,
            fontWeight: "600",
            lineHeight: 12.5,
            color: "#B42318",
            textDecorationLine: "underline",
          }}
        >
          자세히
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
