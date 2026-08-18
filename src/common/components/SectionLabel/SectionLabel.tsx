import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/** 섹션 라벨 — 12 / 600 · #8E8E8E. 화면마다 같은 규격을 쓴다 */
interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel(props: SectionLabelProps) {
  const { label, className } = props;

  return (
    <View className={cn("px-14 py-10", className)}>
      <Typography variant="sectionLabel" className="text-gray55">
        {label}
      </Typography>
    </View>
  );
}
