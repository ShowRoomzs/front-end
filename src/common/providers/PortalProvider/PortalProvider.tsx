import { ReactNode } from "react";

import PortalHost from "@/common/components/PortalHost/PortalHost";
import { BottomSheetProvider } from "@/common/providers/BottomSheetProvider";
import { TooltipProvider } from "@/common/providers/TooltipProvider";

interface PortalProviderProps {
  children: ReactNode;
}

export default function PortalProvider(props: PortalProviderProps) {
  const { children } = props;

  return (
    <TooltipProvider>
      <BottomSheetProvider>
        {children}
        <PortalHost />
      </BottomSheetProvider>
    </TooltipProvider>
  );
}
