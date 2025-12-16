import { useContext } from "react";

import { TooltipContext } from "../providers/TooltipProvider";

export function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }

  return context;
}
