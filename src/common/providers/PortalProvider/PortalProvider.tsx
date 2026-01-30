import { ReactNode } from "react";

import PortalHost from "@/common/components/PortalHost/PortalHost";
import { AddressSearchProvider } from "@/common/providers/AddressSearchProvider";
import { BottomSheetProvider } from "@/common/providers/BottomSheetProvider";
import BottomTabProvider from "@/common/providers/BottomTabProvider";
import DropdownProvider from "@/common/providers/DropdownProvider/DropdownProvider";
import TabsProvider from "@/common/providers/TabsProvider";
import { ToastProvider } from "@/common/providers/ToastProvider";
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
              <AddressSearchProvider>
                <ToastProvider>
                  {children}
                  <PortalHost />
                </ToastProvider>
              </AddressSearchProvider>
            </BottomSheetProvider>
          </TooltipProvider>
        </BottomTabProvider>
      </DropdownProvider>
    </TabsProvider>
  );
}
