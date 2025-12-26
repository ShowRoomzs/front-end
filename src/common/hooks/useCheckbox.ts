import { useContext } from "react";

import { CheckboxContext } from "@/common/providers/CheckboxProvider/context";

export function useCheckbox() {
  const ctx = useContext(CheckboxContext);

  if (!ctx) {
    throw new Error("useCheckbox must be used within CheckboxProvider");
  }

  return ctx;
}
