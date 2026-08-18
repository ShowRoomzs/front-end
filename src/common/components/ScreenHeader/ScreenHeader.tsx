import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 스택 화면 헤더 — 높이 46 · 뒤로 24(stroke 1.8) · 제목 16/600 · -0.3.
 * 제목은 한 줄로 자른다(쇼룸명처럼 긴 값이 들어와도 헤더가 두 줄이 되지 않게).
 */
interface ScreenHeaderProps {
  title?: string;
  onPressBack: () => void;
  renderRight?: ReactNode;
}

export default function ScreenHeader(props: ScreenHeaderProps) {
  const { title, onPressBack, renderRight } = props;

  return (
    <View className="border-b-[0.5px] border-divider bg-white">
      <View className="h-46 flex-row items-center" style={{ paddingLeft: 2, paddingRight: 12 }}>
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.4} className="p-11">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 5l-7 7 7 7"
              stroke="#0F0F0F"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Typography
          style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
          className="min-w-0 flex-1 text-ink"
          numberOfLines={1}
        >
          {title ?? ""}
        </Typography>

        {renderRight}
      </View>
    </View>
  );
}
