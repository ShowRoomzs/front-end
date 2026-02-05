import { ReactNode, useCallback, useState } from "react";

import { TabsContext } from "@/common/providers/TabsProvider/context";

interface TabsProviderProps {
  children: ReactNode;
}

export default function TabsProvider(props: TabsProviderProps) {
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
    <TabsContext.Provider
      value={{
        isVisible,
        show,
        hide,
        toggle,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
