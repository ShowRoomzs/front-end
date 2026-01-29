import { useCallback, useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 500;

export function useTabIndex(
  initialIndex: number | undefined = undefined,
  delayMs: number = DEFAULT_DELAY_MS
) {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number | undefined>(undefined);

  const update = useCallback((newIndex: number) => {
    setSelectedTabIndex(newIndex);
  }, []);

  useEffect(() => {
    if (selectedTabIndex !== undefined || initialIndex === undefined || initialIndex === -1) {
      return;
    }
    setTimeout(() => {
      update(initialIndex);
    }, delayMs);
  }, [initialIndex, selectedTabIndex, update, delayMs]);

  return {
    selectedTabIndex: selectedTabIndex || 0,
    updateTabIndex: update,
  };
}
