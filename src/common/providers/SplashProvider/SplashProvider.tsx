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
          <Image source={logo} className="h-25 w-full" />
        </Animated.View>
      )}
    </View>
  );
}
