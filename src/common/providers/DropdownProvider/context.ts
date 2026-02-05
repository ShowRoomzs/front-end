import { createContext } from "react";

export interface DropdownContextValue {
  openStatus: Record<string, boolean>;
  open: (id: string) => void;
  close: (id: string) => void;
  closeAll: () => void;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);
