import { createContext, useContext } from "react";

import type { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";

export interface AddressSearchContextValue {
  openAddressSearch: (onSelect: (data: DaumPostcodeData) => void) => void;
}

export const AddressSearchContext = createContext<AddressSearchContextValue | null>(null);

export function useAddressSearch() {
  const ctx = useContext(AddressSearchContext);

  if (!ctx) {
    throw new Error("useAddressSearch must be used within AddressSearchProvider");
  }
  return ctx;
}
