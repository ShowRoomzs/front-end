import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 접힌 상세 정보의 높이 (시안 C7 `detailMax`).
 *
 * 화면 폭(≈390)에 맞추면 첫 이미지 한 장에서 잘려 "상세가 이게 전부인가" 싶게 끝난다.
 * 620은 이미지 한 장 + 본문 도입부까지 보이는 높이라, 더 볼지 말지를 판단할 근거가 남는다.
 */
const COLLAPSED_HEIGHT = 620;

/** 페이드는 **아래 90px에만** 건다 — 전체에 깔면 접힌 내용이 통째로 흐려져 읽히지 않는다 */
const FADE_HEIGHT = 90;

interface ProductDetailInfoProps {
  description: string; // html 형태
  isExpand: boolean;
  onPressExpand: () => void;
  /**
   * 접힌 본문과 [상세 정보 더 보기] **사이**에 들어가는 자리 — 지금은 고시 요약 표다(시안 C7).
   *
   * 표를 버튼 아래로 내리면 본문을 펼칠 때마다 표가 화면 밖으로 밀려난다. 요약은 본문을
   * 펼치든 아니든 항상 같은 자리에 있어야 하는 값이라 버튼보다 위에 둔다.
   */
  beforeExpandButton?: ReactNode;
}

export default function ProductDetailInfo(props: ProductDetailInfoProps) {
  const { description, isExpand, onPressExpand, beforeExpandButton } = props;
  const [height, setHeight] = useState(0);

  const htmlContent = useMemo(
    () =>
      `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 16px; overflow: hidden; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${description}
      </body>
    </html>
  `,
    [description]
  );

  const injectedJS = `
    setTimeout(() => {
      const height = document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(height);
    }, 100);
    true;
  `;

  const handleMessage = useCallback((e: WebViewMessageEvent) => {
    const height = Number(e.nativeEvent.data);

    setHeight(height);
  }, []);

  const shouldDisplayExpandButton = useMemo(() => height > COLLAPSED_HEIGHT, [height]);

  return (
    <View>
      <View style={{ height: isExpand ? height : COLLAPSED_HEIGHT, overflow: "hidden" }}>
        <WebView
          source={{ html: htmlContent }}
          injectedJavaScript={injectedJS}
          onMessage={handleMessage}
          style={{ height: height || COLLAPSED_HEIGHT }}
          scrollEnabled={false}
          pointerEvents="none"
          originWhitelist={["*"]}
        />
        {shouldDisplayExpandButton && !isExpand && (
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: FADE_HEIGHT,
            }}
          />
        )}
      </View>
      {beforeExpandButton}

      {shouldDisplayExpandButton ? (
        <View className="px-14 pb-20 pt-16">
          <TouchableOpacity
            onPress={onPressExpand}
            activeOpacity={0.75}
            className="h-44 flex-row items-center justify-center rounded-base border border-gray3"
            style={{ gap: 6 }}
          >
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
              {isExpand ? "상세 정보 접기" : "상세 정보 더 보기"}
            </Typography>
            <ChevronDownIcon
              size={12}
              color="#3C3C3C"
              style={{ transform: [{ rotate: isExpand ? "180deg" : "0deg" }] }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        /* 버튼이 없으면 그 자리의 아래 여백도 사라져 다음 밴드가 표에 붙는다 */
        <View className="h-20" />
      )}
    </View>
  );
}
