import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * C7 갤러리 아래 브랜드 줄.
 *
 * 팔로우 버튼이 없다 — 팔로우는 쇼룸(크리에이터)에 거는 것이고, 여기 이름은 상품을 대는
 * 브랜드(마켓)다. 마켓은 소비자에게 조회되지 않으므로 이름을 눌러 들어갈 화면도 없고,
 * 브랜드로 나가는 길은 서버가 주는 brandSiteUrl 하나다. 링크가 없으면 이름만 남는다.
 */
interface ProductDetailBrandSectionProps {
  marketName: string;
  brandSiteUrl?: string | null;
  onPressBrandSite: () => void;
}

export default function ProductDetailBrandSection(props: ProductDetailBrandSectionProps) {
  const { marketName, brandSiteUrl, onPressBrandSite } = props;

  return (
    <View className="flex-row items-center justify-between border-b-[0.5px] border-t-[0.5px] border-divider px-14 py-10">
      <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 17.55 }} className="text-ink">
        {marketName}
      </Typography>

      {!!brandSiteUrl && (
        <TouchableOpacity
          onPress={onPressBrandSite}
          activeOpacity={0.6}
          className="flex-row items-center"
          style={{ gap: 4, paddingVertical: 8, marginVertical: -8 }}
        >
          <Typography variant="button" className="text-gray45">
            브랜드 사이트
          </Typography>
          <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
            <Path d="M9.5 8H16v6.5" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
            <Path d="M8.4 15.6L16 8" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
}
