import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { BUSINESS_INFO } from "@/common/constants/business";

/**
 * 사업자 정보 푸터 — 회색 밴드(#F7F7F8) 안에 접기/펼치기로 넣고 11px · #737373로 둔다.
 *
 * 사업자등록번호 · 통신판매업신고번호 · 고객센터는 법정 고지이자 실제로 읽어야 하는 정보라
 * 명도차(4.6:1)를 확보하고, 위계는 색이 아니라 크기와 굵기로만 낮춘다.
 * 통신판매중개자 고지는 전자상거래법상 필수 표기라 별도 문단으로 분리한다.
 */
interface BusinessFooterProps {
  /** 마이 탭은 접힌 채로 시작하고, 상품 상세의 상세정보 탭은 펼친 채로 둔다 */
  defaultExpanded?: boolean;
  /**
   * 약관·처리방침·사업자정보확인 링크 줄 — **마이 탭에만** 둔다(시안 C 마이).
   *
   * 접기 밖에 두어 항상 보이게 한다 — 푸터 관례상 위 [도움말] 그룹과 중복되지만,
   * 앱을 떠나기 전 마지막으로 닿는 자리라 접어 두면 열어보는 사람이 없다.
   * 상품 상세(C7)의 푸터에는 이 줄이 없다 — 거기서는 고지만 닿으면 된다.
   */
  links?: Array<{ label: string; onPress: () => void }>;
  /** 마이는 위 그룹과 10만큼 띄운다 */
  marginTop?: number;
}

export default function BusinessFooter(props: BusinessFooterProps) {
  const { defaultExpanded = false, links, marginTop } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View className="bg-band px-14" style={{ paddingTop: 20, paddingBottom: 26, marginTop }}>
      <TouchableOpacity
        onPress={() => setIsExpanded(prev => !prev)}
        activeOpacity={0.6}
        className="flex-row items-center"
        style={{ gap: 5, paddingVertical: 6, marginVertical: -6 }}
      >
        <Typography style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 17 }} className="text-gray45">
          쇼룸즈 사업자 정보
        </Typography>
        <ChevronDownIcon
          size={11}
          color="#C7C7C7"
          style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-10">
          {[
            BUSINESS_INFO.companyLine,
            BUSINESS_INFO.address,
            BUSINESS_INFO.registrationNumber,
            BUSINESS_INFO.mailOrderNumber,
            BUSINESS_INFO.privacyOfficer,
            BUSINESS_INFO.customerService,
            BUSINESS_INFO.operatingHours,
          ].map(line => (
            <Typography key={line} variant="legal" className="text-gray45">
              {line}
            </Typography>
          ))}

          <Typography variant="legal" className="mt-14 text-gray45">
            {BUSINESS_INFO.intermediaryNotice}
          </Typography>
        </View>
      )}

      {!!links?.length && (
        <>
          <View className="mt-16 flex-row" style={{ gap: 14 }}>
            {links.map(link => (
              <Typography
                key={link.label}
                onPress={link.onPress}
                style={{ fontSize: 11, fontWeight: "500", lineHeight: 11 }}
                className="text-gray55"
              >
                {link.label}
              </Typography>
            ))}
          </View>

          <Typography style={{ fontSize: 11, lineHeight: 11, marginTop: 14 }} className="text-gray55">
            {BUSINESS_INFO.copyright}
          </Typography>
        </>
      )}
    </View>
  );
}
