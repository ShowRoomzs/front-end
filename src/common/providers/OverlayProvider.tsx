import { createContext, ReactNode, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

import { BottomSheetProvider } from "./BottomSheetProvider";
import { TooltipProvider } from "./TooltipProvider";
import BottomSheetRenderer from "../components/BottomSheet/BottomSheetRenderer";
import SceneLayout from "../components/OverlayLayout/OverlayLayout";
import TooltipRenderer from "../components/Tooltip/TooltipRenderer";

interface OverlayContextValue {
  scale: SharedValue<number>;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

interface OverlayProviderProps {
  children: ReactNode;
}

function OverlayHost() {
  return (
    <>
      <TooltipRenderer />
      <BottomSheetRenderer />
      {/* TODO : Modal, BottomSheet, Toast renderer 추가 */}
    </>
  );
}

export default function OverlayProvider({ children }: OverlayProviderProps) {
  const scale = useSharedValue(1);

  return (
    <OverlayContext.Provider value={{ scale }}>
      <SceneLayout>
        <TooltipProvider>
          <BottomSheetProvider>
            {children}
            <OverlayHost />
          </BottomSheetProvider>
        </TooltipProvider>
      </SceneLayout>
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);

  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }

  return ctx;
}
