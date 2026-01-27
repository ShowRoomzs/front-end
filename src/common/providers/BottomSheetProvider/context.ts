import { createContext, ReactElement, RefObject, useContext } from "react";

import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

import { BottomSheetProps } from "@/common/components/BottomSheet/BottomSheet";

export type SheetId = string;

export interface SheetApi {
  open: (id: SheetId) => void;
  close: () => void;
  isOpen: boolean;
}

export interface SheetRegistryItem {
  render: ReactElement;
  sheetProps?: Partial<BottomSheetProps>;
}

export interface BottomSheetContextValue {
  register: (id: SheetId, item: SheetRegistryItem) => void;
  unregister: (id: SheetId) => void;
  open: (id: SheetId) => void;
  close: () => void;

  activeSheetId: SheetId | null;
  sheetRef: RefObject<BottomSheetModalMethods | null>;
  registry: Map<SheetId, SheetRegistryItem>;
}

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheetContext() {
  const ctx = useContext(BottomSheetContext);

  if (!ctx) {
    throw new Error("useBottomSheetContext must be used within BottomSheetProvider");
  }
  return ctx;
}
