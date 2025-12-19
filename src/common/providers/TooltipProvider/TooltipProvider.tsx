import { createRef, ReactNode, RefObject, useCallback, useState } from "react";
import { View } from "react-native";

import { TooltipContext, TooltipConfig, TooltipInstance } from "./context";

interface TooltipProviderProps {
  children: ReactNode;
}

export function TooltipProvider(props: TooltipProviderProps) {
  const { children } = props;
  const [tooltipInstances, setTooltipInstances] = useState<Map<string, TooltipInstance>>(new Map());

  const show = useCallback((id: string, config: TooltipConfig) => {
    setTooltipInstances(prev => {
      const newMap = new Map(prev);
      const existingInstance = newMap.get(id);

      if (existingInstance) {
        newMap.set(id, {
          ...existingInstance,
          config,
          isOpen: true,
        });
      } else {
        newMap.set(id, {
          config,
          isOpen: true,
          tooltipRef: createRef<View>(),
        });
      }

      return newMap;
    });
  }, []);

  const hide = useCallback((id: string) => {
    setTooltipInstances(prev => {
      const newMap = new Map(prev);
      const existingInstance = newMap.get(id);

      if (existingInstance) {
        newMap.set(id, {
          ...existingInstance,
          isOpen: false,
        });
      }

      return newMap;
    });
  }, []);

  const hideAll = useCallback(() => {
    setTooltipInstances(prev => {
      const newMap = new Map(prev);

      newMap.forEach(instance => {
        instance.isOpen = false;
      });
      return newMap;
    });
  }, []);

  const getInstance = useCallback(
    (id: string) => {
      return tooltipInstances.get(id);
    },
    [tooltipInstances]
  );

  const getActiveInstances = useCallback(() => {
    const activeInstances = new Map<string, TooltipInstance>();

    tooltipInstances.forEach((instance, id) => {
      if (instance.isOpen) {
        activeInstances.set(id, instance);
      }
    });
    return activeInstances;
  }, [tooltipInstances]);

  const registerInstance = useCallback((id: string, ref: RefObject<View | null>) => {
    setTooltipInstances(prev => {
      if (prev.has(id)) {
        return prev;
      }

      const newMap = new Map(prev);

      newMap.set(id, {
        config: { renderContent: "" },
        isOpen: false,
        tooltipRef: ref,
      });
      return newMap;
    });
  }, []);

  const contextValue = {
    show,
    hide,
    hideAll,
    getInstance,
    getActiveInstances,
    registerInstance,
  };

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
}
