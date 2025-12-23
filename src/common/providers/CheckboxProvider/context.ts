import { createContext } from "react";

export interface CheckboxContextValue {
  checkedItems: Set<string>;
  toggleItem: (id: string) => void;
  toggleAll: (allIds: string[]) => void;
  isAllChecked: (allIds: string[]) => boolean;
  isChecked: (id: string) => boolean;
}

export const CheckboxContext = createContext<CheckboxContextValue | null>(null);
