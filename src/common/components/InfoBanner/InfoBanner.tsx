import { View } from "react-native";

import { ShoppingBagIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 안내 배너 — 회색 인포 블록. 배경 #F7F7F8 · R8 · 패딩 12–13.
 *
 * - `guide` 행동을 안내할 때 — 쇼핑백 18 + 본문 12.5/1.55 #3C3C3C
 * - `note` 참고 고지 — 아이콘 없이 11.5/1.7 #737373
 *
 * 로즈 틴트(#FEF4F6)는 경고·차단 전용이라 안내에 쓰지 않고, 좌측 컬러 보더도 쓰지 않는다.
 */
interface InfoBannerProps {
  message: string;
  variant?: "guide" | "note";
  className?: string;
}

export default function InfoBanner(props: InfoBannerProps) {
  const { message, variant = "guide", className } = props;

  if (variant === "note") {
    return (
      <View className={cn("rounded-base bg-band px-13 py-12", className)}>
        <Typography variant="infoNote" className="text-gray45">
          {message}
        </Typography>
      </View>
    );
  }

  return (
    <View className={cn("flex-row rounded-base bg-band px-13 py-12", className)} style={{ gap: 8 }}>
      <View style={{ marginTop: 1 }}>
        <ShoppingBagIcon size={18} />
      </View>
      <Typography variant="infoBody" className="flex-1 text-ink76">
        {message}
      </Typography>
    </View>
  );
}
