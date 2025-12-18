import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";

import { BottomSheetContext, SheetId, SheetRegistryItem } from "./context";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

interface BottomSheetProviderProps {
  children: ReactNode;
}

export function BottomSheetProvider(props: BottomSheetProviderProps) {
  const { children } = props;
  const sheetRef = useRef<BottomSheetModalMethods | null>(null);

  const [registry, setRegistry] = useState<Map<SheetId, SheetRegistryItem>>(new Map());
  const [activeSheetId, setActiveSheetId] = useState<SheetId | null>(null);

  const register = useCallback((id: SheetId, item: SheetRegistryItem) => {
    setRegistry(prev => {
      const next = new Map(prev);

      next.set(id, item);
      return next;
    });
  }, []);

  const unregister = useCallback((id: SheetId) => {
    setRegistry(prev => {
      if (!prev.has(id)) {
        return prev;
      }
      const next = new Map(prev);

      next.delete(id);
      return next;
    });
  }, []);

  const open = useCallback((id: SheetId) => {
    setActiveSheetId(id);
    requestAnimationFrame(() => {
      sheetRef.current?.present();
    });
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
    setActiveSheetId(null);
  }, []);

  const value = useMemo(
    () => ({
      register,
      unregister,
      open,
      close,
      activeSheetId,
      sheetRef,
      registry,
    }),
    [register, unregister, open, close, activeSheetId, registry]
  );

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
}
