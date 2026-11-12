import { ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";

import wordmark from "../../../../assets/splash-wordmark.png";

/**
 * 웹 스플래시 — 네이티브 스플래시가 없으니 폰트·세션 준비가 끝날 때까지만 같은 워드마크를 덮어 둔다.
 *
 * 네이티브 판(SplashProvider.tsx)은 `Image.resolveAssetSource`로 원본 비율을 읽는데, react-native-web에는
 * 그 함수가 없어 모듈을 읽는 순간 앱 전체가 멈춘다. 비율은 `assets/splash-wordmark.png`(1600×319)에서 옮겨 적었다 —
 * 이미지를 다시 구우면 함께 고칠 것.
 */
export const NATIVE_FADE_MS = 0;

const WORDMARK_WIDTH = 262;
const WORDMARK_HEIGHT = Math.round((WORDMARK_WIDTH * 319) / 1600);

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

  return (
    <View style={styles.root}>
      {children}
      {!isReady && (
        <View style={styles.overlay}>
          <Image source={wordmark} resizeMode="contain" style={styles.wordmark} />
        </View>
      )}
    </View>
  );
}
