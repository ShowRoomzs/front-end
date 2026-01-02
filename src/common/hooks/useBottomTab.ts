import { useContext } from "react";

import { BottomTabContext } from "@/common/providers/BottomTabProvider/context";

export function useBottomTab() {
  const ctx = useContext(BottomTabContext);

  if (!ctx) {
    throw new Error("useBottomTab must be used within BottomTabProvider");
  }

  return ctx;
}
