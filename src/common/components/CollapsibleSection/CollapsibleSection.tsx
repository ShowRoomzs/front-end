import { ReactNode, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 접히는 정보 섹션 — 제목 줄을 눌러 펴고 접는다 (C7 판매자 정보 탭).
 *
 * 본문을 회색 밴드(#F7F7F8) 위에 올리는 이유는, 펼쳤을 때 **어디까지가 이 섹션인지**가
 * 색으로 드러나야 세 섹션이 이어져 있어도 경계가 읽히기 때문이다.
 *
 * `defaultExpanded`는 보통 **첫 항목에만** 준다 — 탭에 들어왔을 때 전부 접혀 있으면 빈 목록처럼
 * 보이고, 전부 펼쳐 있으면 무엇이 접히는 자리인지 알 수 없다.
 */
interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  /** 본문 좌우/상하 여백 — 섹션마다 내용 형태가 달라 부르는 쪽이 정한다 */
  bodyStyle?: { paddingHorizontal?: number; paddingTop?: number; paddingBottom?: number };
  children: ReactNode;
}

export default function CollapsibleSection(props: CollapsibleSectionProps) {
  const { title, defaultExpanded = false, bodyStyle, children } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsExpanded(prev => !prev)}
        activeOpacity={0.7}
        className="flex-row items-center px-14"
        style={{ gap: 10, paddingVertical: 17 }}
      >
        <Typography
          style={{ fontSize: 14, fontWeight: "600", lineHeight: 19.6 }}
          className="min-w-0 flex-1 text-ink"
        >
          {title}
        </Typography>
        <ChevronDownIcon
          size={14}
          color="#C7C7C7"
          style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View
          className="bg-band"
          style={{
            paddingHorizontal: bodyStyle?.paddingHorizontal ?? 14,
            paddingTop: bodyStyle?.paddingTop ?? 14,
            paddingBottom: bodyStyle?.paddingBottom ?? 14,
          }}
        >
          {children}
        </View>
      )}

      <View style={{ height: 0.5, backgroundColor: "#F0F0F0" }} />
    </View>
  );
}
