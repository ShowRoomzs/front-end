import { useCallback, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextLayoutEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 게시물 본문 — 400 · 13.5 · 2줄 클램프, 넘치면 끝에 "더 보기"(#8E8E8E).
 *
 * **쇼룸명은 일반 게시물에서만** 본문 앞에 굵게(600) 붙는다. 캡션이 미디어 아래에 오는 형태라
 * 누가 한 말인지가 헤더에서 한참 떨어져 있기 때문이다. 공구 게시물은 바로 위에 제목이 있어
 * 이름을 한 번 더 쓸 이유가 없다.
 *
 * RN에는 CSS의 line-clamp + 말줄임 뒤 텍스트 삽입이 없어, 보이지 않는 사본으로 줄 수를 먼저 재고
 * 넘칠 때만 "더 보기"를 오른쪽 아래에 겹쳐 놓는다.
 */
interface PostCaptionProps {
  /** 넘기면 본문 앞에 굵게 붙는다 — 일반 게시물 전용 */
  showroomName?: string;
  content: string;
  /** 일반 캡션은 잉크, 공구 본문은 잉크76 */
  color?: string;
  /** 일반 20.9(1.55) · 공구 21.6(1.6) */
  lineHeight?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const CLAMP_LINES = 2;

export default function PostCaption(props: PostCaptionProps) {
  const { showroomName, content, color = "text-ink", lineHeight = 20.9, className, style } = props;
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMeasure = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const lines = e.nativeEvent.lines.length;

    setLineCount(prev => (prev === null ? lines : prev));
  }, []);

  const isTruncated = lineCount !== null && lineCount > CLAMP_LINES && !isExpanded;

  const body = (
    <>
      {!!showroomName && <Typography style={{ fontWeight: "600" }}>{`${showroomName} `}</Typography>}
      <Typography>{content}</Typography>
    </>
  );

  return (
    <View className={className} style={style}>
      {/* 줄 수 측정용 사본 — 클램프 없이 그려야 실제 줄 수를 알 수 있다 */}
      {lineCount === null && (
        <Typography
          variant="body"
          style={{ lineHeight, position: "absolute", opacity: 0 }}
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
            style={{ lineHeight }}
            className={color}
            numberOfLines={isExpanded ? undefined : CLAMP_LINES}
          >
            {body}
          </Typography>

          {isTruncated && (
            <View className="absolute bottom-0 right-0 flex-row bg-white pl-6">
              <Typography variant="body" style={{ lineHeight }} className="text-gray55">
                ... 더 보기
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
