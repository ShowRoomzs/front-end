import { ReactNode } from "react";

import PortalHost from "@/common/components/PortalHost/PortalHost";
import { BottomSheetProvider } from "@/common/providers/BottomSheetProvider";
import BottomTabProvider from "@/common/providers/BottomTabProvider";
import DropdownProvider from "@/common/providers/DropdownProvider/DropdownProvider";
import TabsProvider from "@/common/providers/TabsProvider";
import { TooltipProvider } from "@/common/providers/TooltipProvider";

interface PortalProviderProps {
  children: ReactNode;
}

export default function PortalProvider(props: PortalProviderProps) {
  const { children } = props;

  return (
    <TabsProvider>
      <DropdownProvider>
        <BottomTabProvider>
          <TooltipProvider>
            <BottomSheetProvider>
              {children}
              <PortalHost />
            </BottomSheetProvider>
          </TooltipProvider>
        </BottomTabProvider>
      </DropdownProvider>
    </TabsProvider>
  );
}
