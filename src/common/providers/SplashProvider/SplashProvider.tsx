import { ReactNode, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import wordmark from "../../../../assets/splash-wordmark.png";

/**
 * 네이티브 런치 스크린을 그대로 이어받는 오버레이 (시안 C19).
 *
 * 앱이 준비될 때까지 화면을 덮는다. **네이티브 스플래시와 달라 보이면 안 된다** —
 * 다르면 켤 때마다 그 차이가 깜빡임으로 보인다.
 *
 * 크기는 **가로·세로를 숫자로 못 박는다.** `aspectRatio`로 높이를 유도하거나 `className`으로
 * 잡으면 워드마크가 화면 밖으로 넘칠 만큼 커지는 일이 있었다. 원본이 1500×237이고
 * 262pt 폭으로 놓으므로 높이는 262 × 237 / 1500 = 41.4 하나뿐이다.
 *
 * 이미지 아래쪽 투명 여백은 일부러 넣은 것이다(`scripts/build-splash-wordmark.py`).
 * 화면 정중앙에 놓으면 그 여백만큼 글자가 위로 올라가 시안이 말한 시각 중심에 앉는다.
 */
/** app.config.ts 의 `imageWidth` 와 반드시 같아야 한다 */
const WORDMARK_WIDTH = 262;

/**
 * 높이는 **원본 파일에서 읽어 계산한다.**
 *
 * 원본 비율을 숫자로 적어 두면 이미지를 다시 구울 때마다(폭을 바꾸면 아래 여백이 달라져
 * 높이가 같이 변한다) 두 값이 어긋난다 — 실제로 한 번 어긋나 글자가 화면 밖으로 넘쳤다.
 */
const SOURCE = Image.resolveAssetSource(wordmark);
const WORDMARK_HEIGHT = Math.round((WORDMARK_WIDTH * SOURCE.height) / SOURCE.width);

/**
 * NativeWind를 쓰지 않고 StyleSheet로 둔다 — 이 화면은 앱에서 제일 먼저 그려지는 자리라
 * 스타일이 한 군데에서만 와야 무엇이 적용됐는지 의심할 여지가 없다.
 */
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  root: { flex: 1 },
  wordmark: { height: WORDMARK_HEIGHT, width: WORDMARK_WIDTH },
});

interface SplashProviderProps {
  children: ReactNode;
  isReady: boolean;
}

export default function SplashProvider(props: SplashProviderProps) {
  const { children, isReady } = props;
  const isMounted = useRef(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isReady && !isMounted.current) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 100);

      isMounted.current = true;

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <View style={styles.root}>
      {children}
      {showSplash && (
        <Animated.View exiting={FadeOut.duration(200)} style={styles.overlay}>
          <Image source={wordmark} resizeMode="contain" style={styles.wordmark} />
        </Animated.View>
      )}
    </View>
  );
}
