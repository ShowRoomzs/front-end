import { ReactNode } from "react";
import { useSharedValue } from "react-native-reanimated";

import OverlayHost from "@/common/components/OverlayHost/OverlayHost";
import OverlayLayout from "@/common/components/OverlayLayout/OverlayLayout";
import { BottomSheetProvider } from "@/common/providers/BottomSheetProvider";
import { OverlayContext } from "@/common/providers/OverlayProvider/context";
import { TooltipProvider } from "@/common/providers/TooltipProvider";

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
