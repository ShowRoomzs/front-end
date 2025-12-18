import { useContext } from "react";

import { OverlayContext } from "../providers/OverlayProvider/context";

export function useOverlay() {
  const ctx = useContext(OverlayContext);

  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }

  return ctx;
}
