import { useCallback, useEffect, useState } from "react";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import { ModalConfig, ModalContext, ModalStateContext } from "./context";
import { registerModalHandler, unregisterModalHandler } from "./modal";

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider(props: ModalProviderProps) {
  const { children } = props;

  const [currentModal, setCurrentModal] = useState<ModalConfig | null>(null);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const show = useCallback(
    (config: ModalConfig) => {
      setCurrentModal(config);
      opacity.value = 0;
      scale.value = 0.95;
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    },
    [opacity, scale]
  );

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: 150 }, finished => {
      if (finished) {
        runOnJS(setCurrentModal)(null);
      }
    });
    scale.value = withTiming(0.95, { duration: 150 });
  }, [opacity, scale]);

  useEffect(() => {
    registerModalHandler({ show, hide });

    return () => {
      unregisterModalHandler();
    };
  }, [show, hide]);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      <ModalStateContext.Provider value={{ currentModal, opacity, scale }}>
        {children}
      </ModalStateContext.Provider>
    </ModalContext.Provider>
  );
}
