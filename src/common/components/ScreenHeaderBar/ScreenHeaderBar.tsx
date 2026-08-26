import { View } from "react-native";

import HeaderActions from "@/common/components/HeaderActions/HeaderActions";
import Typography from "@/common/components/Typography/Typography";

/**
 * 탭 화면 헤더 — 제목 + 검색 · 장바구니. C2 팔로잉 · C3 좋아요가 같은 규격을 쓴다.
 * (C1 홈만 제목 대신 검색 필드가 들어가 별도 헤더를 쓴다)
 */
interface ScreenHeaderBarProps {
  title: string;
}

export default function ScreenHeaderBar(props: ScreenHeaderBarProps) {
  const { title } = props;

  return (
    <View className="border-b-[0.5px] border-divider bg-white">
      <View className="flex-row items-center pb-12 pt-2" style={{ paddingHorizontal: 16 }}>
        <Typography style={{ fontSize: 18, fontWeight: "700", lineHeight: 18, letterSpacing: -0.5 }}>
          {title}
        </Typography>
        <View className="flex-1" />
        <HeaderActions />
      </View>
    </View>
  );
}
