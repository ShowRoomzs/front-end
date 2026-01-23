import { useContext } from "react";

import { TabsContext } from "@/common/providers/TabsProvider/context";

export function useTabs() {
  const ctx = useContext(TabsContext);

  if (!ctx) {
    throw new Error("useTabs must be used within TabsProvider");
  }

  return ctx;
}
