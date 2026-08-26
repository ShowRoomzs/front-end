import { useMemo } from "react";

import Typography, { TypographyProps } from "@/common/components/Typography/Typography";

/**
 * 검색어와 **일치하는 구간만 색을 바꿔** 왜 이 행이 걸렸는지 보이게 한다 (C14).
 *
 * 이름이 맞았는지 아이디가 맞았는지가 눈으로 구분돼야, 같은 이름의 쇼룸을 아이디로 가려낼 수 있다.
 * 색은 로즈 텍스트(#CF3D61)다 — 흰 배경 위에 얹는 로즈는 한 단계 어두운 값을 쓴다.
 *
 * 검색어는 사용자가 친 문자열이라 정규식 특수문자(`(`, `+`, `[` …)가 그대로 들어올 수 있다.
 * 이스케이프하지 않으면 정규식 생성이 **예외를 던져 화면이 통째로 죽는다.**
 */
interface HighlightTypoProps extends TypographyProps {
  keyword: string;
  highlightClassName?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function HighlightTypo(props: HighlightTypoProps) {
  const { keyword, highlightClassName = "text-roseText", children, ...typoProps } = props;

  const trimmed = keyword.trim();

  const parts = useMemo(() => {
    if (!trimmed || typeof children !== "string") {
      return null;
    }
    return children.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"));
  }, [children, trimmed]);

  if (!parts) {
    return <Typography {...typoProps}>{children}</Typography>;
  }

  return (
    <Typography {...typoProps}>
      {parts.map((part, index) =>
        // 일치 구간에만 색을 얹는다. 나머지는 클래스를 주지 않아 바깥 글자색을 그대로 물려받는다
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <Typography key={`${part}-${index}`} className={highlightClassName}>
            {part}
          </Typography>
        ) : (
          part
        )
      )}
    </Typography>
  );
}
