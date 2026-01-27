import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

const WINDOW_WIDTH = Dimensions.get("window").width;

interface ProductDetailInfoProps {
  description: string; // html 형태
  isExpand: boolean;
  onPressExpand: () => void;
}

export default function ProductDetailInfo(props: ProductDetailInfoProps) {
  const { description, isExpand, onPressExpand } = props;
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

  const shouldDisplayExpandButton = useMemo(() => height > WINDOW_WIDTH, [height]);

  return (
    <View>
      <View style={{ height: isExpand ? height : WINDOW_WIDTH, overflow: "hidden" }}>
        <WebView
          source={{ html: htmlContent }}
          injectedJavaScript={injectedJS}
          onMessage={handleMessage}
          style={{ height: height || WINDOW_WIDTH }}
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
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
      </View>
      {shouldDisplayExpandButton && (
        <View className="px-20">
          <Button size="md" variant="outline" className="mt-15" onPress={onPressExpand}>
            <HStack gap={8} className="items-center">
              <Typography className="text-13 text-black font-medium">
                {isExpand ? "접기" : "더 보기"}
              </Typography>
              <Icon
                icon={COMMON_ASSETS.arrowDown}
                style={{ transform: [{ rotate: isExpand ? "180deg" : "0deg" }] }}
              />
            </HStack>
          </Button>
        </View>
      )}
    </View>
  );
}
