import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

import { GlobalLoadingActionsContext } from "./context";

import Spinner from "@/common/components/Spinner/Spinner";

interface GlobalLoadingProviderProps {
  children: React.ReactNode;
}

const DEFAULT_BACKDROP_OPACITY = 0.7;

export function GlobalLoadingProvider(props: GlobalLoadingProviderProps) {
  const { children } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [backdropOpacity, setBackdropOpacity] = useState(DEFAULT_BACKDROP_OPACITY);

  const show = useCallback((opacity?: number) => {
    setBackdropOpacity(opacity ?? DEFAULT_BACKDROP_OPACITY);
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <GlobalLoadingActionsContext.Provider value={{ show, hide }}>
      {children}
      {isVisible && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `rgba(0,0,0,${backdropOpacity})`, zIndex: 9999 },
          ]}
          className="items-center justify-center"
        >
          <Spinner size={36} color="#000000" />
        </View>
      )}
    </GlobalLoadingActionsContext.Provider>
  );
}
