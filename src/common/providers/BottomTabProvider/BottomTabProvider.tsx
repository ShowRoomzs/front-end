import { ReactNode, useCallback, useState } from "react";

import { BottomTabContext } from "@/common/providers/BottomTabProvider/context";

interface BottomTabProviderProps {
  children: ReactNode;
}

export default function BottomTabProvider(props: BottomTabProviderProps) {
  const { children } = props;
  const [isVisible, setIsVisible] = useState(true);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return (
    <BottomTabContext.Provider
      value={{
        isVisible,
        show,
        hide,
        toggle,
      }}
    >
      {children}
    </BottomTabContext.Provider>
  );
}
