import { ReactNode, useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import logo from "../../../../assets/logo.png";

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
          className="absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center bg-black"
        >
          {/*
            resizeMode를 지정하지 않으면 RN Image는 cover다 — 박스를 채우려고 넘치는 쪽을 잘라낸다.
            워드마크(1500×100)를 390×25 박스에 cover로 넣으면 세로가 26px이 되어 1px이 넘치고,
            이 로고는 위아래 여백이 0이라 그 1px이 그대로 글자를 깎는다.
          */}
          <Image source={logo} resizeMode="contain" className="h-25 w-full" />
        </Animated.View>
      )}
    </View>
  );
}
