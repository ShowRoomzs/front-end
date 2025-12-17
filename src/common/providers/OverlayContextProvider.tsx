import { ReactNode } from "react";

import { BottomSheetProvider } from "./BottomSheetProvider";
import { TooltipProvider } from "./TooltipProvider";
import BottomSheetRenderer from "../components/BottomSheet/BottomSheetRenderer";
import TooltipRenderer from "../components/Tooltip/TooltipRenderer";

interface OverlayContextProviderProps {
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

export default function OverlayContextProvider(props: OverlayContextProviderProps) {
  const { children } = props;

  return (
    <TooltipProvider>
      <BottomSheetProvider>
        {children}
        <OverlayHost />
      </BottomSheetProvider>
    </TooltipProvider>
  );
}
