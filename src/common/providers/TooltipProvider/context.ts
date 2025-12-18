import { createContext, RefObject, useContext } from "react";
import { View } from "react-native";

import { TooltipProps } from "@/common/components/Tooltip/Tooltip";

export type TooltipConfig = TooltipProps;

export interface TooltipInstance {
  config: TooltipConfig;
  isOpen: boolean;
  tooltipRef: RefObject<View | null>;
}

export type TooltipContextValue = {
  show: (tooltipId: string, config: TooltipConfig) => void;
  hide: (tooltipId: string) => void;
  hideAll: () => void;
  getInstance: (tooltipId: string) => TooltipInstance | undefined;
  getActiveInstances: () => Map<string, TooltipInstance>;
  registerInstance: (tooltipId: string, ref: RefObject<View | null>) => void;
};

export const TooltipContext = createContext<TooltipContextValue | undefined>(undefined);

export function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }

  return context;
}
