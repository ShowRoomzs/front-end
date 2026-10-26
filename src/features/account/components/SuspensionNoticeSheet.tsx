import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";
import {
  SUSPENSION_CAN,
  SUSPENSION_CANNOT,
  formatShortDate,
  formatSuspendedAt,
} from "@/features/account/constants/suspension";
import { Suspension } from "@/features/account/types/accountStatus";

/**
 * C20 1c 정지 안내 시트.
 *
 * 정지 사유 · 일시 · 기간 · 자동 해제 → 할 수 없는 것 / 할 수 있는 것을 한 블록으로 나란히 둬, 무엇이 막혔는지보다
 * **무엇은 여전히 되는지**(진행 중 주문의 배송 · 반품 권리)를 함께 확인시킨다.
 *
 * 기간 · 해제일이 없는 정지(기간 없는 정지 · 옛 회원)는 그 줄을 그리지 않는다 — 「[정책값 미정]」 같은 자리표시를
 * 내보내지 않는다. 오른쪽 [1:1 문의로 이의 신청]이 권장 액션이다(시트 · 모달 규칙).
 */
interface SuspensionNoticeSheetProps {
  suspension: Suspension;
  onPressClose: () => void;
  onPressAppeal: () => void;
}

const MIN_BOTTOM_PADDING = 24;

export default function SuspensionNoticeSheet(props: SuspensionNoticeSheetProps) {
  const { suspension, onPressClose, onPressAppeal } = props;
  const { bottom } = useSafeAreaInsets();
  const { term } = suspension;

  const rows = [
    { key: "정지 사유", value: suspension.reasonLabel, strong: true },
    { key: "정지 일시", value: formatSuspendedAt(suspension.suspendedAt) },
    { key: "정지 기간", value: term?.periodDays ? `${term.periodDays}일` : null },
    {
      key: "자동 해제",
      value: term?.autoReleaseAt
        ? `${term.autoReleaseAt.slice(0, 10)} · 기간이 끝나면 자동으로 해제돼요`
        : null,
    },
  ].filter(row => !!row.value);

  const deadline = formatShortDate(term?.appealDeadlineAt ?? null);

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, MIN_BOTTOM_PADDING), paddingTop: 4 }}>
      <View className="px-20">
        <View className="flex-row">
          <View
            className="rounded-base"
            style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: "#FDECEC" }}
          >
            <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 11, color: "#B42318" }}>
              이용 정지
            </Typography>
          </View>
        </View>
        <Typography
          style={{ fontSize: 18, fontWeight: "700", lineHeight: 25.2, letterSpacing: -0.4, marginTop: 10 }}
          className="text-ink"
        >
          이용이 정지된 계정이에요
        </Typography>

        {rows.length > 0 && (
          <View style={{ marginTop: 14, gap: 6 }}>
            {rows.map(row => (
              <View key={row.key} className="flex-row" style={{ gap: 14 }}>
                <Typography style={{ width: 62, fontSize: 13, lineHeight: 20.8 }} className="text-gray45">
                  {row.key}
                </Typography>
                <Typography
                  style={{ fontSize: 13, fontWeight: row.strong ? "600" : "400", lineHeight: 20.8 }}
                  className="min-w-0 flex-1 text-ink"
                >
                  {row.value}
                </Typography>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mx-20 rounded-base bg-band p-14" style={{ marginTop: 18 }}>
        <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-ink76">
          할 수 없는 것
        </Typography>
        <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 8 }} className="text-ink76">
          {SUSPENSION_CANNOT}
        </Typography>
        <Typography
          style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5, marginTop: 14 }}
          className="text-ink76"
        >
          할 수 있는 것
        </Typography>
        <Typography style={{ fontSize: 13, lineHeight: 22.1, marginTop: 8 }} className="text-ink76">
          {SUSPENSION_CAN}
        </Typography>
      </View>

      <Typography style={{ fontSize: 12, lineHeight: 19.8 }} className="px-20 pt-12 text-gray45">
        {`이의 신청 기한: 통지 후 3영업일 이상${deadline ? `(${deadline}까지)` : ""} · 1:1 문의로 알려주세요. 확인 후 답변드려요.`}
      </Typography>

      <View className="flex-row px-20" style={{ paddingTop: 18, gap: 8 }}>
        <TouchableOpacity
          onPress={onPressClose}
          activeOpacity={0.6}
          className="h-52 flex-1 items-center justify-center rounded-base border-[1px] border-borderButton"
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-ink76">
            닫기
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressAppeal}
          activeOpacity={0.75}
          className="h-52 items-center justify-center rounded-base bg-rose"
          style={{ flex: 1.6 }}
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-white">
            1:1 문의로 이의 신청
          </Typography>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
}
