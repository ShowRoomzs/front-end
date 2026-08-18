import { View } from "react-native";

import { EmptyBagIcon } from "@/common/components/DsIcon/icons";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";

/**
 * 임시 화면 — 서버가 아직 그 기능을 갖고 있지 않은 자리다.
 *
 * 메뉴에서 항목을 지우지 않고 화면을 두는 이유는, 없어진 줄 알고 문의가 들어오는 것보다
 * "아직 준비 중"이라고 말해 주는 편이 낫기 때문이다(비로그인 메뉴 행을 회색 처리하지 않는 것과
 * 같은 판단이다). 기능이 붙으면 이 파일을 실제 화면으로 갈아 끼운다.
 */
interface ComingSoonViewProps {
  title: string;
  description?: string;
  onPressBack: () => void;
}

export default function ComingSoonView(props: ComingSoonViewProps) {
  const { title, description = "준비가 끝나면 알려드릴게요.", onPressBack } = props;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title={title} onPressBack={onPressBack} />
      <View className="flex-1 items-center justify-center px-30">
        <EmptyBagIcon size={52} />
        <Typography
          style={{ fontSize: 15, fontWeight: "600", lineHeight: 22.5, marginTop: 16 }}
          className="text-center text-ink"
        >
          {title} 기능을 준비하고 있어요
        </Typography>
        <Typography
          variant="caption"
          style={{ lineHeight: 20, marginTop: 6 }}
          className="text-center text-gray45"
        >
          {description}
        </Typography>
      </View>
    </View>
  );
}
