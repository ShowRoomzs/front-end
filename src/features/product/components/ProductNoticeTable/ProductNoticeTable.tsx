import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 구분 / 내용 2열 표 — 상세정보 탭의 요약 표와 판매자 정보 탭의 상품 고시가 함께 쓴다.
 *
 * 항목이 카테고리마다 달라 키를 앱이 들고 있지 않는다. 서버가 준 순서를 그대로 그린다.
 *
 * **모서리를 둥글리지 않는다.** 표는 카드가 아니라 문서의 일부이고, 반경이 들어가면 위아래
 * 본문과 분리된 별개의 블록처럼 떠 보인다.
 *
 * - `spec` 상세정보 탭 — 머리행(구분/내용)을 두고 흰 배경. 다섯 줄 안팎의 요약이라 머리행이
 *   두 열의 뜻을 한 번만 설명하면 된다.
 * - `notice` 판매자 정보 탭의 상품 고시 — 머리행 없이 **키 열을 회색으로 깐다**. 열두 항목이
 *   넘어가면 스크롤 중에 머리행이 화면 밖으로 나가 두 열을 색으로 구분하는 편이 낫다.
 */
export interface NoticeRow {
  key: string;
  value: string;
}

interface ProductNoticeTableProps {
  rows: Array<NoticeRow>;
  variant?: "spec" | "notice";
}

const BORDER = "#EDEDEF";

export default function ProductNoticeTable(props: ProductNoticeTableProps) {
  const { rows, variant = "spec" } = props;

  if (rows.length === 0) {
    return null;
  }

  const isSpec = variant === "spec";
  const keyWidth = isSpec ? "34%" : "38%";
  const cellPadding = isSpec
    ? { paddingHorizontal: 12, paddingVertical: 11 }
    : { paddingHorizontal: 12, paddingVertical: 10 };
  const fontSize = isSpec ? 12.5 : 12;
  const lineHeight = isSpec ? 18.75 : 18.6;

  return (
    <View style={{ borderWidth: 1, borderColor: BORDER, backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      {isSpec && (
        <View
          className="flex-row"
          style={{ backgroundColor: "#FAFAFA", borderBottomWidth: 0.5, borderBottomColor: BORDER }}
        >
          <View style={{ width: keyWidth, ...cellPadding }}>
            <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 16.8 }} className="text-gray45">
              구분
            </Typography>
          </View>
          <View
            className="min-w-0 flex-1"
            style={{ borderLeftWidth: 0.5, borderLeftColor: BORDER, ...cellPadding }}
          >
            <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 16.8 }} className="text-gray45">
              내용
            </Typography>
          </View>
        </View>
      )}

      {rows.map((row, index) => (
        <View
          key={row.key}
          className="flex-row"
          style={index > 0 ? { borderTopWidth: 0.5, borderTopColor: BORDER } : undefined}
        >
          <View
            style={{
              width: keyWidth,
              ...cellPadding,
              ...(isSpec ? null : { backgroundColor: "#FAFAFA" }),
            }}
          >
            <Typography
              style={{ fontSize, fontWeight: "500", lineHeight }}
              className={isSpec ? "text-ink" : "text-ink76"}
            >
              {row.key}
            </Typography>
          </View>

          <View
            className="min-w-0 flex-1"
            style={{ borderLeftWidth: 0.5, borderLeftColor: BORDER, ...cellPadding }}
          >
            <Typography style={{ fontSize, lineHeight }} className="text-ink76">
              {row.value}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  );
}
