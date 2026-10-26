import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { SUSPENSION_SHEET_ID } from "@/features/account/constants/suspension";

/**
 * C20 1b — 비활성 버튼 바로 위의 안내 한 줄 + [자세히].
 *
 * 버튼을 감추지 않고 회색으로 둔 채 이 줄을 붙인다 — 감추면 「왜 살 수 없지?」를 알 수 없어 문의가 는다.
 * [자세히]는 잉크(#3C3C3C)다 — 배너와 달리 차분한 보조 정보라 위험 톤을 쓰지 않는다.
 */
export default function SuspensionBlockedLine(props: { text: string }) {
  const { open } = useBottomSheetContext();

  return (
    <View className="flex-row items-center justify-center" style={{ gap: 6, paddingBottom: 10 }}>
      <Typography style={{ fontSize: 12, lineHeight: 18 }} className="text-gray45">
        {props.text}
      </Typography>
      <Typography
        onPress={() => open(SUSPENSION_SHEET_ID)}
        suppressHighlighting
        style={{ fontSize: 12, fontWeight: "600", lineHeight: 18, textDecorationLine: "underline" }}
        className="text-ink76"
      >
        자세히
      </Typography>
    </View>
  );
}

/** 정지 중 회색 버튼(§02 비활성 규격) — 자리를 지키되 눌리지 않는다 */
export function SuspendedButton(props: { label: string; height?: number; flex?: number }) {
  const { label, height = 52, flex } = props;

  return (
    <View className="items-center justify-center rounded-base bg-fill" style={{ height, flex }}>
      <Typography style={{ fontSize: 15.5, fontWeight: "600", lineHeight: 15.5 }} className="text-gray71">
        {label}
      </Typography>
    </View>
  );
}
