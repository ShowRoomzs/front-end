import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";

export interface OverlayContextValue {
  scale: SharedValue<number>;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);
