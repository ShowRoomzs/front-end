import { createContext, createRef, ReactNode, RefObject, useCallback, useState } from "react";
import { View } from "react-native";

import { TooltipProps } from "../components/Tooltip/Tooltip";
import TooltipRenderer from "../components/Tooltip/TooltipRenderer";

export type TooltipConfig = TooltipProps;

export interface TooltipInstance {
  config: TooltipConfig;
  isOpen: boolean;
  tooltipRef: RefObject<View | null>;
}

type TooltipContextValue = {
  show: (tooltipId: string, config: TooltipConfig) => void;
  hide: (tooltipId: string) => void;
  hideAll: () => void;
  getInstance: (tooltipId: string) => TooltipInstance | undefined;
  getActiveInstances: () => Map<string, TooltipInstance>;
  registerInstance: (tooltipId: string, ref: RefObject<View | null>) => void;
};

export const TooltipContext = createContext<TooltipContextValue | undefined>(undefined);

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

  const contextValue: TooltipContextValue = {
    show,
    hide,
    hideAll,
    getInstance,
    getActiveInstances,
    registerInstance,
  };

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      <TooltipRenderer />
    </TooltipContext.Provider>
  );
}
