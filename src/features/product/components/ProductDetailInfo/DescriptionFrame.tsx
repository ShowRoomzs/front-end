import { useCallback } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";

/**
 * 상품 상세 HTML 본문을 그리는 틀 — 앱은 WebView, 웹은 iframe(`DescriptionFrame.web.tsx`).
 * 다 그려진 본문 높이를 `onHeight`로 알린다(접힘 · 펼침 계산에 쓴다).
 */
interface DescriptionFrameProps {
  html: string;
  /** 높이를 재기 전 자리 */
  fallbackHeight: number;
  height: number;
  onHeight: (height: number) => void;
}

const MEASURE_JS = `
    setTimeout(() => {
      const height = document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(height);
    }, 100);
    true;
  `;

export default function DescriptionFrame(props: DescriptionFrameProps) {
  const { html, fallbackHeight, height, onHeight } = props;

  const handleMessage = useCallback(
    (e: WebViewMessageEvent) => {
      onHeight(Number(e.nativeEvent.data));
    },
    [onHeight]
  );

  return (
    <WebView
      source={{ html }}
      injectedJavaScript={MEASURE_JS}
      onMessage={handleMessage}
      style={{ height: height || fallbackHeight }}
      scrollEnabled={false}
      pointerEvents="none"
      originWhitelist={["*"]}
    />
  );
}
