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
 * 넘칠 때만 "더 보기"를 2번째 줄 글 바로 뒤에 겹쳐 놓는다(줄이 꽉 찼으면 오른쪽 끝). 펼친 글은 본문을 다시 누르면 2줄로 접힌다.
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
/** 2번째 줄 글과 「... 더 보기」 사이 */
const MORE_GAP = 4;

export default function PostCaption(props: PostCaptionProps) {
  const { showroomName, content, color = "text-ink", lineHeight = 20.9, className, style } = props;
  const [lineCount, setLineCount] = useState<number | null>(null);
  /** 접었을 때 마지막 줄(2번째 줄)의 글자 폭 — 「더 보기」를 그 바로 뒤에 붙인다. 빈 줄이면 0 */
  const [clampLineWidth, setClampLineWidth] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [moreWidth, setMoreWidth] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMeasure = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    const clampLine = lines[CLAMP_LINES - 1];
    const width = clampLine?.text.trim() ? clampLine.width : 0;

    setLineCount(prev => (prev === null ? lines.length : prev));
    setClampLineWidth(prev => (prev === null ? width : prev));
  }, []);

  /** 2줄을 넘는 글 — 이때만 눌러서 펼치고, 펼친 뒤 다시 누르면 접는다 */
  const isOverflowing = lineCount !== null && lineCount > CLAMP_LINES;
  const isTruncated = isOverflowing && !isExpanded;

  /**
   * 「더 보기」 자리 — 2번째 줄 글 바로 뒤. 짧은 줄 · 빈 줄 뒤에 빈 칸이 남지 않게 한다.
   * 그 뒤에 들어갈 폭이 없으면(줄이 꽉 찼으면) 오른쪽 끝에 겹쳐 줄 끝을 가린다.
   */
  const fitsAfterText =
    clampLineWidth !== null &&
    moreWidth > 0 &&
    containerWidth > 0 &&
    clampLineWidth + MORE_GAP + moreWidth <= containerWidth;
  const morePosition = fitsAfterText
    ? { left: clampLineWidth, paddingLeft: clampLineWidth > 0 ? MORE_GAP : 0 }
    : { right: 0, paddingLeft: 6 };

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
        activeOpacity={isOverflowing ? 0.55 : 1}
        onPress={() => isOverflowing && setIsExpanded(prev => !prev)}
      >
        <View onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
          <Typography
            variant="body"
            style={{ lineHeight }}
            className={color}
            numberOfLines={isExpanded ? undefined : CLAMP_LINES}
          >
            {body}
          </Typography>

          {isTruncated && (
            <View className="absolute bottom-0 flex-row bg-white" style={morePosition}>
              <Typography
                variant="body"
                style={{ lineHeight }}
                className="text-gray55"
                onLayout={e => setMoreWidth(e.nativeEvent.layout.width)}
              >
                ... 더 보기
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
