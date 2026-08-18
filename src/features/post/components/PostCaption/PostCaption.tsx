import { useCallback, useState } from "react";
import { NativeSyntheticEvent, TextLayoutEventData, TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 게시물 본문 — 400 · 13.5 / 1.55 · 2줄 클램프, 넘치면 끝에 "더 보기"(#8E8E8E).
 *
 * 쇼룸명을 본문 앞에 굵게(600) 붙인다 — 카드 헤더에도 이름이 있지만, 캡션이 미디어 아래에 오는
 * 일반 게시물에서는 누가 한 말인지가 헤더에서 한참 떨어져 있다.
 *
 * RN에는 CSS의 line-clamp + 말줄임 뒤 텍스트 삽입이 없어, 보이지 않는 사본으로 줄 수를 먼저 재고
 * 넘칠 때만 "더 보기"를 오른쪽 아래에 겹쳐 놓는다.
 */
interface PostCaptionProps {
  showroomName: string;
  content: string;
  className?: string;
}

const CLAMP_LINES = 2;

export default function PostCaption(props: PostCaptionProps) {
  const { showroomName, content, className } = props;
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMeasure = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const lines = e.nativeEvent.lines.length;

    setLineCount(prev => (prev === null ? lines : prev));
  }, []);

  const isTruncated = lineCount !== null && lineCount > CLAMP_LINES && !isExpanded;

  const body = (
    <>
      <Typography style={{ fontWeight: "600" }}>{`${showroomName} `}</Typography>
      <Typography>{content}</Typography>
    </>
  );

  return (
    <View className={className}>
      {/* 줄 수 측정용 사본 — 클램프 없이 그려야 실제 줄 수를 알 수 있다 */}
      {lineCount === null && (
        <Typography
          variant="body"
          style={{ lineHeight: 20.9, position: "absolute", opacity: 0 }}
          onTextLayout={handleMeasure}
          pointerEvents="none"
        >
          {body}
        </Typography>
      )}

      <TouchableOpacity
        activeOpacity={isTruncated ? 0.6 : 1}
        onPress={() => isTruncated && setIsExpanded(true)}
      >
        <View>
          <Typography
            variant="body"
            style={{ lineHeight: 20.9 }}
            className="text-ink"
            numberOfLines={isExpanded ? undefined : CLAMP_LINES}
          >
            {body}
          </Typography>

          {isTruncated && (
            <View className="absolute bottom-0 right-0 flex-row bg-white pl-6">
              <Typography variant="body" style={{ lineHeight: 20.9 }} className="text-gray55">
                ... 더 보기
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
