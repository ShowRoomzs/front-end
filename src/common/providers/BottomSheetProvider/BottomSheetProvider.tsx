import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";

import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

import {
  BottomSheetContext,
  SheetId,
  SheetRegistryItem,
} from "@/common/providers/BottomSheetProvider/context";

interface BottomSheetProviderProps {
  children: ReactNode;
}

export function BottomSheetProvider(props: BottomSheetProviderProps) {
  const { children } = props;
  const sheetRef = useRef<BottomSheetModalMethods | null>(null);

  const [registry, setRegistry] = useState<Map<SheetId, SheetRegistryItem>>(new Map());
  const [activeSheetId, setActiveSheetId] = useState<SheetId | null>(null);
  const activeSheetIdRef = useRef<SheetId | null>(null);
  /**
   * 시트가 지금 화면에 보이는지 — 시트 자체의 onChange로만 갱신한다. 아래로 밀거나 배경을 눌러 닫으면
   * activeSheetId는 그대로라서, 그 값으로 뒤로가기를 가로채면 시트가 없는데도 뒤로가기가 먹통이 된다.
   */
  const isSheetVisibleRef = useRef(false);

  const register = useCallback((id: SheetId, item: SheetRegistryItem) => {
    setRegistry(prev => {
      const next = new Map(prev);

      next.set(id, item);
      return next;
    });
  }, []);

  const unregister = useCallback((id: SheetId) => {
    // 열린 시트의 주인 화면이 사라지면 시트도 닫는다 — 그대로 두면 내용 없는 빈 시트가 다음 화면을 덮는다
    if (activeSheetIdRef.current === id) {
      sheetRef.current?.dismiss();
      activeSheetIdRef.current = null;
      setActiveSheetId(null);
    }
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
    activeSheetIdRef.current = id;
    setActiveSheetId(id);
    requestAnimationFrame(() => {
      sheetRef.current?.present();
    });
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
    activeSheetIdRef.current = null;
    setActiveSheetId(null);
  }, []);

  const onSheetChange = useCallback((index: number) => {
    isSheetVisibleRef.current = index >= 0;
  }, []);

  // 안드로이드 뒤로가기 — 시트가 보이면 화면 대신 시트를 닫는다
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isSheetVisibleRef.current) {
        return false;
      }
      close();
      return true;
    });

    return () => subscription.remove();
  }, [close]);

  const value = useMemo(
    () => ({
      register,
      unregister,
      open,
      close,
      onSheetChange,
      activeSheetId,
      sheetRef,
      registry,
    }),
    [register, unregister, open, close, onSheetChange, activeSheetId, registry]
  );

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
}
