import { ReactNode, useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import wordmark from "../../../../assets/splash-wordmark.png";

/**
 * 네이티브 런치 스크린을 그대로 이어받는 오버레이 (시안 C19).
 *
 * 앱이 준비될 때까지 화면을 덮는다. **네이티브 스플래시와 한 픽셀도 다르면 안 된다** —
 * 다르면 켤 때마다 그 차이가 깜빡임으로 보인다. 예전에는 여기가 검은 배경이라
 * 흰 런치 스크린 → 검은 오버레이 → 흰 홈으로 검은 섬광이 지나갔다.
 *
 * 그래서 `app.config.ts`의 `expo-splash-screen` 설정과 **같은 이미지·같은 폭**을 쓴다.
 * 이미지 아래쪽의 투명 여백까지 같이 들어오므로, 화면 정중앙에 놓기만 하면
 * 워드마크가 네이티브와 똑같은 자리(시각 중심)에 앉는다.
 */
const WORDMARK_SOURCE_RATIO = 1500 / 237;
/** app.config.ts 의 `imageWidth` 와 반드시 같아야 한다 */
const WORDMARK_WIDTH = 262;

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
    <View className="flex-1">
      {children}
      {showSplash && (
        <Animated.View
          exiting={FadeOut.duration(200)}
          className="absolute bottom-0 left-0 right-0 top-0 flex-1 items-center justify-center bg-white"
        >
          {/*
            폭을 픽셀로 고정한다 — 화면 비율로 잡으면 기기마다 네이티브와 어긋나 전환이 튄다.
            `aspectRatio`로 높이를 정하지 않으면 RN이 원본 크기를 그대로 써서 폭 지정이 무시된다.
          */}
          <Image
            source={wordmark}
            resizeMode="contain"
            style={{ width: WORDMARK_WIDTH, aspectRatio: WORDMARK_SOURCE_RATIO }}
          />
        </Animated.View>
      )}
    </View>
  );
}
