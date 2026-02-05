import { createContext } from "react";

export interface TabsContextValue {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);
