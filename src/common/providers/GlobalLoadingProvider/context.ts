import { createContext, useContext } from "react";

interface GlobalLoadingActionsContextValue {
  show: (backdropOpacity?: number) => void;
  hide: () => void;
}

export const GlobalLoadingActionsContext = createContext<GlobalLoadingActionsContextValue | null>(null);

export function useGlobalLoadingActions() {
  const context = useContext(GlobalLoadingActionsContext);

  if (!context) {
    throw new Error("useGlobalLoadingActions must be used within a GlobalLoadingProvider");
  }

  return context;
}
