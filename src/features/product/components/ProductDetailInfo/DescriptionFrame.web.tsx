import { useCallback, useEffect, useRef } from "react";

/**
 * 상품 상세 HTML 본문 (웹) — WebView 대신 iframe(srcdoc)에 그린다.
 *
 * - `sandbox="allow-same-origin"`: 판매자가 넣은 HTML의 **스크립트는 실행하지 않는다**(allow-scripts 없음).
 *   같은 출처로 두어야 부모가 본문 높이를 잴 수 있다 — 스크립트가 막혀 있어 같은 출처여도 안전하다.
 * - 높이: 처음 그려질 때 한 번, 이미지가 하나씩 받아질 때마다 다시 잰다(이미지가 늦게 와 키가 자란다).
 */
interface DescriptionFrameProps {
  html: string;
  fallbackHeight: number;
  height: number;
  onHeight: (height: number) => void;
}

export default function DescriptionFrame(props: DescriptionFrameProps) {
  const { html, fallbackHeight, height, onHeight } = props;
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const onHeightRef = useRef(onHeight);

  onHeightRef.current = onHeight;

  const measure = useCallback(() => {
    const body = frameRef.current?.contentDocument?.body;

    if (body) {
      onHeightRef.current(body.scrollHeight);
    }
  }, []);

  const handleLoad = useCallback(() => {
    measure();
    const doc = frameRef.current?.contentDocument;

    doc?.querySelectorAll("img").forEach(image => {
      if (!image.complete) {
        image.addEventListener("load", measure, { once: true });
        image.addEventListener("error", measure, { once: true });
      }
    });
  }, [measure]);

  // 창 폭이 바뀌면 줄바꿈이 달라져 높이도 바뀐다
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <iframe
      ref={frameRef}
      title="상품 상세 정보"
      srcDoc={html}
      sandbox="allow-same-origin"
      onLoad={handleLoad}
      scrolling="no"
      style={{
        width: "100%",
        height: height || fallbackHeight,
        border: 0,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
