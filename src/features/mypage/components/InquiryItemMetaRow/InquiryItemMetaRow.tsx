import { View } from "react-native";

import Badge from "@/common/components/Badge/Badge";
import Typography from "@/common/components/Typography/Typography";
import { InquiryStatus } from "@/features/inquiry/types/inquiry";

/**
 * 문의 한 건의 머리 줄 — 상태 배지 · 유형 · 작성일 (C12).
 *
 * 1:1 문의와 상품 문의는 맥락 줄(주문 카드 / 상품명)만 다르고 **골격은 같다**. 한 목록에서
 * 두 종류를 오갈 때 눈이 다시 적응하지 않도록 머리 줄을 공유한다.
 *
 * 상태를 맨 앞에 두는 이유는 목록에서 가장 먼저 궁금한 것이 "답변이 왔는지"라서다.
 * **답변 대기가 로즈 채움**이고 완료가 중립인 것도 같은 이유 — 강조는 기다리는 쪽에 준다.
 */
interface InquiryItemMetaRowProps {
  status: InquiryStatus;
  typeName: string;
  date: string;
}

export default function InquiryItemMetaRow(props: InquiryItemMetaRowProps) {
  const { status, typeName, date } = props;
  const isWaiting = status === "WAITING";

  return (
    <View className="flex-row items-center" style={{ gap: 7 }}>
      <Badge label={isWaiting ? "답변 대기" : "답변 완료"} variant={isWaiting ? "rose" : "neutral"} />

      <Typography style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 11.5 }} className="text-gray45">
        {typeName}
      </Typography>

      <View className="flex-1" />

      <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
        {date}
      </Typography>
    </View>
  );
}
