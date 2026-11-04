import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";

/**
 * 약관 본문 자리 표시 — 시행일 줄(아래 구분선) → 조문 문단 셋(13 · 줄 높이 24 · 문단 간격 20).
 * TermsDocumentBody 틀(px-20 · 위 18 · 아래 14)을 따른다.
 */
const PARAGRAPHS = [
  ["38%", "96%", "90%", "62%"],
  ["42%", "94%", "88%", "93%", "40%"],
  ["34%", "92%", "70%"],
];

export default function TermsBodySkeleton() {
  return (
    <View>
      <View className="border-b-[0.5px] border-dividerProduct px-20 pb-14 pt-18">
        <SkeletonBlock width={168} height={10} sub />
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 32 }}>
        {PARAGRAPHS.map((lines, ix) => (
          <View key={ix} style={{ gap: 13 }}>
            {lines.map((width, line) => (
              <SkeletonBlock key={line} width={width as `${number}%`} height={11} sub={line > 0} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
