import { useContext, useRef } from "react";
import { View } from "react-native";

import { TooltipConfig, TooltipContext } from "../providers/TooltipProvider";

export function useTooltip(tooltipId: string) {
  const context = useContext(TooltipContext);
  const tooltipRef = useRef<View>(null);

  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }

  if (!tooltipId) {
    throw new Error("useTooltip must be provided tooltipId");
  }

  const { getInstance, show, hide } = context;

  const existingInstance = getInstance(tooltipId);

  if (!existingInstance) {
    show(tooltipId, { renderContent: "" });
    hide(tooltipId);
  }
  const instance = getInstance(tooltipId);

  if (instance && instance.tooltipRef !== tooltipRef) {
    instance.tooltipRef = tooltipRef;
  }

  return {
    tooltipRef,
    show: (config: TooltipConfig) => show(tooltipId, config),
    hide: () => hide(tooltipId),
  };
}
