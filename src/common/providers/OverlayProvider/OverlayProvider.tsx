import { ReactNode } from "react";
import { useSharedValue } from "react-native-reanimated";

import OverlayHost from "../../components/OverlayHost/OverlayHost";
import OverlayLayout from "../../components/OverlayLayout/OverlayLayout";
import { BottomSheetProvider } from "../BottomSheetProvider";
import { TooltipProvider } from "../TooltipProvider";
import { OverlayContext } from "./context";

interface OverlayProviderProps {
  children: ReactNode;
}

export default function OverlayProvider(props: OverlayProviderProps) {
  const { children } = props;
  const scale = useSharedValue(1);

  return (
    <OverlayContext.Provider value={{ scale }}>
      <TooltipProvider>
        <BottomSheetProvider>
          <OverlayLayout>{children}</OverlayLayout>
          <OverlayHost />
        </BottomSheetProvider>
      </TooltipProvider>
    </OverlayContext.Provider>
  );
}
