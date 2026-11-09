import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import wordmark from "../../../../assets/splash-wordmark.png";

/**
 * 스플래시 워드마크 오버레이 (시안 C19) — 가운데 로즈 SHOWROOMZ 하나만 보인다.
 *
 * 앱이 준비될 때까지 화면을 덮고, 준비되면 0.2초에 걸쳐 걷힌다.
 *
 * **네이티브 스플래시는 오버레이가 자리를 잡는 즉시 닫는다**(앱 준비를 기다리지 않는다).
 * - iOS: 네이티브 런치 스크린이 이 오버레이와 같은 워드마크 · 같은 자리라 바뀌는 게 보이지 않는다
 * - 안드로이드: 네이티브 스플래시는 흰 화면뿐이다(app.config.ts — Android 12+ 가 가운데 이미지를
 *   원으로 잘라 시안 크기 워드마크를 넣을 수 없다). 그 흰 화면이 0.2초에 걸쳐 걷히면서 이 워드마크가
 *   페이드인된다(App.tsx `setOptions`). 준비까지 기다렸다 닫으면 그동안 내내 빈 흰 화면만 보인다
 *
 * 크기는 **가로·세로를 숫자로 못 박는다.** `aspectRatio`로 높이를 유도하거나 `className`으로
 * 잡으면 워드마크가 화면 밖으로 넘칠 만큼 커지는 일이 있었다. 폭 262pt, 높이는 원본 비율로 아래에서 계산한다.
 *
 * 이미지 아래쪽 투명 여백은 일부러 넣은 것이다(`scripts/build-splash-wordmark.py`).
 * 화면 정중앙에 놓으면 그 여백만큼 글자가 위로 올라가 시안이 말한 시각 중심에 앉는다.
 */
/** app.config.ts 의 `imageWidth` 와 반드시 같아야 한다 */
const WORDMARK_WIDTH = 262;

/** 네이티브 스플래시가 걷히는 길이 = 워드마크 페이드인 — App.tsx `SplashScreen.setOptions`의 duration과 같아야 한다 */
export const NATIVE_FADE_MS = 200;
/** 워드마크가 다 나타난 뒤 걷히기 전까지 머무는 시간 */
const HOLD_MS = 400;

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
  /** 네이티브 스플래시를 닫은 시각 — 그때부터 워드마크 페이드인이 시작된다 */
  const nativeHiddenAt = useRef<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // 워드마크 이미지가 실제로 그려질 준비가 된 뒤에 닫는다 — 레이아웃만 잡히고 이미지가 아직이면
  // 안드로이드에서 흰 화면이 걷힌 자리에 또 흰 화면이 보인다
  const hideNativeSplash = useCallback(() => {
    if (nativeHiddenAt.current !== null) {
      return;
    }
    nativeHiddenAt.current = Date.now();
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isReady && !isMounted.current) {
      // 이미지 로드 콜백이 오지 않는 경우에도 네이티브 스플래시가 남아 앱을 가리지 않게 한다
      hideNativeSplash();

      /*
        페이드인이 끝난 뒤에 걷는다. 앱이 금방 준비되면(로그인 · 캐시가 있는 재실행) 글자가 다 나타나기도
        전에 사라지기 시작해, 실기기에서 워드마크가 0.3초 깜빡이고 끝났다.
        페이드인(200) → 그대로 400 → 페이드아웃(200) — 짧게 스치면 깜빡임처럼 보여 11-09 사용자 요청으로 100에서 늘렸다.
      */
      const fadeInLeft = Math.max(0, (nativeHiddenAt.current ?? 0) + NATIVE_FADE_MS - Date.now());
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, fadeInLeft + HOLD_MS);

      isMounted.current = true;

      return () => clearTimeout(timer);
    }
  }, [hideNativeSplash, isReady]);

  return (
    <View style={styles.root}>
      {children}
      {showSplash && (
        <Animated.View exiting={FadeOut.duration(200)} style={styles.overlay}>
          <Image
            source={wordmark}
            resizeMode="contain"
            style={styles.wordmark}
            onLoad={hideNativeSplash}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}
