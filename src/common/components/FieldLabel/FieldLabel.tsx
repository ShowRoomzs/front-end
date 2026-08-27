import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 폼 필드 라벨 — 13/600 #3C3C3C (C12 · C13 공통).
 *
 * `(선택)`은 라벨 안에서 400·#737373로 한 단계 낮춰 붙인다 — 별도 배지로 만들면
 * 필수 항목에도 배지가 있어야 할 것처럼 보인다.
 * `right`는 글자 수 카운터처럼 라벨 줄 우측에 고정되는 값이다.
 */
interface InquiryFieldLabelProps {
  label: string;
  optional?: boolean;
  right?: string;
}

export default function InquiryFieldLabel(props: InquiryFieldLabelProps) {
  const { label, optional = false, right } = props;

  return (
    <View className="flex-row items-baseline justify-between">
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
        {label}
        {optional && (
          <Typography style={{ fontSize: 13, fontWeight: "400", lineHeight: 13 }} className="text-gray45">
            {" (선택)"}
          </Typography>
        )}
      </Typography>

      {!!right && (
        <Typography style={{ fontSize: 12, lineHeight: 12, paddingRight: 2 }} className="text-gray45">
          {right}
        </Typography>
      )}
    </View>
  );
}
