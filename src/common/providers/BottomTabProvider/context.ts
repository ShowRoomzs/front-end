import { createContext } from "react";

export interface BottomTabContextValue {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

export const BottomTabContext = createContext<BottomTabContextValue | null>(null);
