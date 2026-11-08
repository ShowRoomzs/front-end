import { useMemo } from "react";
import { FlatList, View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useMypageNavigation } from "@/common/router";
import licenseData from "@/features/mypage/data/openSourceLicenses.json";

/**
 * 오픈소스 라이선스 (C18 문서 화면과 같은 꼴) — 항목 제목 14.5/600 잉크 + 본문 13/1.85.
 *
 * 목록은 `scripts/generate-licenses.mjs`가 앱에 실려 나가는 패키지에서 만든다(`npm run licenses`).
 * 항목에는 라이선스 이름과 저작권 줄만 두고, 전문은 종류마다 한 번씩 맨 아래에 싣는다 —
 * 같은 MIT 전문을 수백 번 되풀이하면 읽을 수 없는 화면이 된다.
 */
interface LicenseRow {
  key: string;
  heading: string;
  body: string;
  isFullText?: boolean;
}

export default function OpenLicenseView() {
  const navigation = useMypageNavigation();

  const rows = useMemo((): Array<LicenseRow> => {
    const packageRows = licenseData.packages.map(pkg => ({
      key: `${pkg.name}@${pkg.version}`,
      heading: pkg.version ? `${pkg.name} ${pkg.version}` : pkg.name,
      body: pkg.copyright ? `${pkg.license} · ${pkg.copyright}` : pkg.license,
    }));
    const textRows = Object.entries(licenseData.texts as Record<string, string>).map(([license, text]) => ({
      key: `text-${license}`,
      heading: `${license} 전문`,
      body: text,
      isFullText: true,
    }));

    return [...packageRows, ...textRows];
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="오픈소스 라이선스" onPressBack={navigation.goBack} />

      <FlatList
        data={rows}
        keyExtractor={row => row.key}
        initialNumToRender={20}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="border-b-[0.5px] border-dividerProduct px-20 pb-14 pt-18">
            <Typography style={{ fontSize: 12, lineHeight: 19.2 }} className="text-gray45">
              {`이 앱이 사용하는 오픈소스 구성요소 ${licenseData.packages.length}개와 각 라이선스 전문입니다.`}
            </Typography>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 20, paddingTop: index === 0 ? 20 : 0, marginBottom: 20 }}>
            <Typography style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 21.75 }} className="text-ink">
              {item.heading}
            </Typography>
            <Typography
              style={{
                fontSize: item.isFullText ? 12 : 13,
                lineHeight: item.isFullText ? 19.2 : 24.05,
                marginTop: 8,
              }}
              className="text-ink76"
            >
              {item.body}
            </Typography>
          </View>
        )}
      />
    </View>
  );
}
