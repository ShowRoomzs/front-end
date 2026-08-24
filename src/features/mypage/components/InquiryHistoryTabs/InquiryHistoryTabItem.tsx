import { useWindowDimensions, View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";

/**
 * 문의 내역 탭 한 칸 (C12) — 높이 46 · 활성은 잉크 600 + 하단 2px 밑줄, 비활성은 #8E8E8E 400.
 *
 * 라벨 옆에 개수를 함께 둔다. 탭을 눌러 보기 전에 어느 쪽에 몇 건이 있는지 알 수 있어야
 * 헛걸음이 줄어든다. 개수는 라벨보다 한 단계 흐린 색으로 두어 위계를 지킨다.
 */
interface InquiryHistoryTabItemProps extends Omit<TabItemType, "render"> {
  itemLength: number;
  isActive: boolean;
  count?: number;
}

export default function InquiryHistoryTabItem(props: InquiryHistoryTabItemProps) {
  const { id, label, itemLength, isActive, count } = props;
  const pageWidth = useWindowDimensions().width;

  return (
    <View
      key={id}
      style={{
        width: pageWidth / itemLength,
        height: 46,
        gap: 5,
        ...(isActive && { borderBottomWidth: 2, borderBottomColor: "#0F0F0F" }),
      }}
      className="flex-row items-center justify-center"
    >
      <Typography
        style={{ fontSize: 14, fontWeight: isActive ? "600" : "400", lineHeight: 14 }}
        className={isActive ? "text-ink" : "text-gray55"}
      >
        {label}
      </Typography>
      {count !== undefined && (
        <Typography
          style={{ fontSize: 14, fontWeight: isActive ? "600" : "400", lineHeight: 14 }}
          className={isActive ? "text-gray45" : "text-gray71"}
        >
          {count}
        </Typography>
      )}
    </View>
  );
}
