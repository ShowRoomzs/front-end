import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * C7 갤러리 아래 브랜드 줄.
 *
 * 팔로우 버튼이 없다 — 팔로우는 쇼룸(크리에이터)에 거는 것이고, 여기 이름은 상품을 대는
 * 브랜드(마켓)다. 마켓은 소비자에게 조회되지 않으므로 이름을 눌러 들어갈 화면도 없고,
 * 브랜드로 나가는 길은 서버가 주는 brandSiteUrl 하나다. 링크가 없으면 이름만 남는다.
 *
 * **외곽선 버튼으로 두는 이유**는 이 줄에서 유일하게 앱 밖으로 나가는 문이기 때문이다.
 * 회색 글씨로 두면 옆의 브랜드명과 같은 무게로 읽혀 눌러야 할 것으로 보이지 않는다.
 */
interface ProductDetailBrandSectionProps {
  marketName: string;
  brandSiteUrl?: string | null;
  onPressBrandSite: () => void;
}

export default function ProductDetailBrandSection(props: ProductDetailBrandSectionProps) {
  const { marketName, brandSiteUrl, onPressBrandSite } = props;

  return (
    <View
      className="flex-row items-center justify-between border-b-[0.5px] border-divider px-14"
      style={{ gap: 10, paddingTop: 16, paddingBottom: 14 }}
    >
      <Typography
        style={{ fontSize: 13, fontWeight: "600", lineHeight: 16.9 }}
        className="min-w-0 flex-1 text-ink76"
        numberOfLines={1}
      >
        {marketName}
      </Typography>

      {!!brandSiteUrl && (
        /* 버튼 자체는 32px로 두고 상하 6 패딩으로 터치 영역만 44에 가깝게 넓힌다 */
        <TouchableOpacity
          onPress={onPressBrandSite}
          activeOpacity={0.55}
          style={{ paddingVertical: 6, marginVertical: -6 }}
        >
          <View
            className="h-32 flex-row items-center rounded-base border-[1px] border-borderButton px-11"
            style={{ gap: 5 }}
          >
            <Typography
              style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 11.5 }}
              className="text-ink76"
            >
              브랜드 사이트
            </Typography>
            <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
              <Path d="M9.5 8H16v6.5" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
              <Path d="M8.4 15.6L16 8" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
            </Svg>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
