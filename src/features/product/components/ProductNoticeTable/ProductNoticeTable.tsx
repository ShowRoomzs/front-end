import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 구분 / 내용 2열 표 — 상품정보제공고시 · 배송/교환/반품 안내 · 판매자 정보가 함께 쓴다.
 *
 * 항목이 카테고리마다 달라 키를 앱이 들고 있지 않는다. 서버가 준 순서를 그대로 그린다.
 */
export interface NoticeRow {
  key: string;
  value: string;
}

interface ProductNoticeTableProps {
  title?: string;
  rows: Array<NoticeRow>;
}

export default function ProductNoticeTable(props: ProductNoticeTableProps) {
  const { title, rows } = props;

  if (rows.length === 0) {
    return null;
  }

  return (
    <View className="px-14 pb-18 pt-20">
      {!!title && (
        <Typography
          style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2, marginBottom: 12 }}
          className="text-ink"
        >
          {title}
        </Typography>
      )}

      <View className="overflow-hidden rounded-base border-[1px] border-borderButton">
        {rows.map((row, ix) => (
          <View
            key={row.key}
            className="flex-row"
            style={ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : undefined}
          >
            <View className="bg-band px-12 py-10" style={{ flexBasis: 110, flexGrow: 0, flexShrink: 0 }}>
              <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 18 }} className="text-ink76">
                {row.key}
              </Typography>
            </View>
            <View className="min-w-0 flex-1 px-12 py-10">
              <Typography style={{ fontSize: 12, lineHeight: 18 }} className="text-ink76">
                {row.value}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
