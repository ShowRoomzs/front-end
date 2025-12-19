import { useContext, useEffect, useRef } from "react";
import { View } from "react-native";

import { TooltipConfig, TooltipContext } from "@/common/providers/TooltipProvider/context";

export function useTooltip(tooltipId: string) {
  const context = useContext(TooltipContext);
  const tooltipRef = useRef<View>(null);

  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }

  if (!tooltipId) {
    throw new Error("useTooltip must be provided tooltipId");
  }

  const { getInstance, show, hide, registerInstance } = context;

  useEffect(() => {
    const existingInstance = getInstance(tooltipId);

    if (!existingInstance) {
      registerInstance(tooltipId, tooltipRef);
    }
  }, [tooltipId, getInstance, registerInstance]);

  useEffect(() => {
    const instance = getInstance(tooltipId);

    if (instance && instance.tooltipRef !== tooltipRef) {
      instance.tooltipRef = tooltipRef;
    }
  }, [tooltipId, getInstance]);

  return {
    ref: tooltipRef,
    show: (config: TooltipConfig) => show(tooltipId, config),
    hide: () => hide(tooltipId),
  };
}
