import { ReactNode } from "react";

import { TooltipProvider } from "./TooltipProvider";
import TooltipRenderer from "../components/Tooltip/TooltipRenderer";

interface OverlayContextProviderProps {
  children: ReactNode;
}

function OverlayHost() {
  return (
    <>
      <TooltipRenderer />
      {/* TODO : Modal, BottomSheet, Toast renderer 추가 */}
    </>
  );
}

export default function OverlayContextProvider(props: OverlayContextProviderProps) {
  const { children } = props;

  return (
    <TooltipProvider>
      {children}
      <OverlayHost />
    </TooltipProvider>
  );
}
