import { createContext, ReactNode, RefObject, useContext } from "react";
import { View } from "react-native";

import { TooltipProps } from "../components/Tooltip/Tooltip";

type TooltipConfig = TooltipProps;

export interface TooltipInstance {
  config: TooltipConfig;
  isOpen: boolean;
  tooltipRef: RefObject<View>;
}

type TooltipContextValue = {
  show: (tooltipId: string, config: TooltipConfig) => void;
  hide: (tooltipId: string) => void;
  hideAll: () => void;
  getInstance: (tooltipId: string) => TooltipInstance | undefined;
  getAllActive: () => Map<string, TooltipInstance>;
  instances: Map<string, TooltipInstance>;
};

const TooltipContext = createContext<TooltipContextValue | undefined>(undefined);

interface TooltipProviderProps {
  children: ReactNode;
}

export function TooltipProvider(props: TooltipProviderProps) {
  const { children } = props;

  const contextValue: TooltipContextValue = {
    show: () => {},
    hide: () => {},
    hideAll: () => {},
    getInstance: () => undefined,
    getAllActive: () => new Map(),
    instances: new Map(),
  };

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
}

export function useTooltip() {
  const context = useContext(TooltipContext);

  if (context === undefined) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}
