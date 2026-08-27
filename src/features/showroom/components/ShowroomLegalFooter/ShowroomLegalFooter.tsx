import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";
import { BUSINESS_INFO } from "@/common/constants/business";
import { useCommonNavigation, useMypageNavigation } from "@/common/router";
import { COMMON_ROUTES, MYPAGE_ROUTES } from "@/common/router/routes";

/**
 * C4 쇼룸 하단 고지 — 대가관계 안내 · 통신판매중개자 고지 · 법적 링크.
 *
 * **쇼룸은 SNS 링크로 외부에서 바로 착지하는 화면이다.** 앱의 다른 곳을 거치지 않고 여기서
 * 보고 이탈할 수 있으므로, 마이 탭 푸터나 상품 상세의 고지가 이 자리를 대신해 주지 못한다.
 *
 * 대가관계 안내를 맨 위에 두는 이유는 **게시물마다 붙는 [유료 광고 포함] 배지의 근거**이기
 * 때문이다 — 배지만 보고 무슨 뜻인지 모르면 표시를 한 의미가 없다.
 *
 * 마이 탭 푸터와 같은 규격(#F7F7F8 밴드 · 11px · #737373)이라 두 화면이 같은 목소리로 말한다.
 */
const LINK_ROW_HIT_SLOP = 8;

export default function ShowroomLegalFooter() {
  const commonNavigation = useCommonNavigation();
  const mypageNavigation = useMypageNavigation();

  const links = [
    {
      key: "terms",
      label: "이용약관",
      onPress: () =>
        commonNavigation.navigate(COMMON_ROUTES.TERMS_DOCUMENT, { termsType: "TERMS_OF_SERVICE" }),
    },
    {
      key: "privacy",
      label: "개인정보 처리방침",
      onPress: () => commonNavigation.navigate(COMMON_ROUTES.TERMS_DOCUMENT, { termsType: "PRIVACY_POLICY" }),
    },
    {
      // 게시물 하나를 특정할 수 없는 자리라 신고 화면이 아니라 접수 창구로 보낸다.
      // 개별 신고는 각 카드의 ⋯가 맡는다
      key: "report",
      label: "게시물 신고",
      onPress: () => mypageNavigation.navigate(MYPAGE_ROUTES.CUSTOMER_CENTER as never),
    },
  ];

  return (
    <View className="bg-band" style={{ paddingHorizontal: 14, paddingTop: 20, paddingBottom: 26 }}>
      <View className="flex-row items-start" style={{ gap: 9 }}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
          <Circle cx={12} cy={12} r={8.5} stroke="#737373" strokeWidth={1.6} />
          <Path d="M12 10.6v6" stroke="#737373" strokeWidth={1.6} />
          <Path d="M12 7.6v.2" stroke="#737373" strokeWidth={1.6} strokeLinecap="round" />
        </Svg>

        <Typography style={{ fontSize: 11, lineHeight: 18.7 }} className="min-w-0 flex-1 text-gray45">
          이 쇼룸의 일부 게시물은 브랜드로부터 대가를 받아 작성되었으며, 해당 게시물에는{" "}
          <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 18.7 }} className="text-ink76">
            유료 광고 포함
          </Typography>{" "}
          표시가 붙습니다.
        </Typography>
      </View>

      <Typography style={{ fontSize: 11, lineHeight: 18.7, marginTop: 14 }} className="text-gray45">
        {BUSINESS_INFO.intermediaryNotice}
      </Typography>

      <View className="flex-row flex-wrap" style={{ gap: 14, marginTop: 16 }}>
        {links.map(link => (
          <TouchableOpacity
            key={link.key}
            onPress={link.onPress}
            activeOpacity={0.6}
            style={{ paddingVertical: LINK_ROW_HIT_SLOP, marginVertical: -LINK_ROW_HIT_SLOP }}
          >
            <Typography
              style={{ fontSize: 11, fontWeight: "500", lineHeight: 11, textDecorationLine: "underline" }}
              className="text-gray45"
            >
              {link.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
