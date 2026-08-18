import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 디자인 시스템 05 · 배지 — 패딩 4/8 · R8 · 라벨 11/600.
 *
 * - `rose` 공구 신호(D-day). 게시물당 1개만 쓴다.
 * - `neutral` 대가관계 표시("유료 광고 포함") 등. 대가관계는 항상 중립 배지이고 로즈를 쓰지 않는다.
 * - `closed` 마감·품절로 로즈가 죽은 상태 — #F1F1F2 배경 + #8E8E8E 텍스트.
 */
type BadgeVariant = "rose" | "neutral" | "closed";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASS: Record<BadgeVariant, { box: string; text: string }> = {
  rose: { box: "bg-rose", text: "text-white" },
  neutral: { box: "bg-fill", text: "text-gray45" },
  closed: { box: "bg-badgeClosedBg", text: "text-gray55" },
};

export default function Badge(props: BadgeProps) {
  const { label, variant = "rose", className } = props;
  const variantClass = VARIANT_CLASS[variant];

  return (
    <View className={cn("self-start rounded-base px-8 py-4", variantClass.box, className)}>
      <Typography variant="badge" className={variantClass.text}>
        {label}
      </Typography>
    </View>
  );
}
