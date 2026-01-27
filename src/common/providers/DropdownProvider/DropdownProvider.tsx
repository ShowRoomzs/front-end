import { produce } from "immer";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import { DropdownContext } from "@/common/providers/DropdownProvider/context";

interface DropdownProviderProps {
  children: ReactNode;
}
export default function DropdownProvider(props: DropdownProviderProps) {
  const { children } = props;
  const [openStatus, setOpenStatus] = useState<Record<string, boolean>>({});
  const ignoreCloseOnceRef = useRef(false);

  const closeAll = useCallback(() => {
    setOpenStatus({});
  }, []);

  const open = useCallback((id: string) => {
    ignoreCloseOnceRef.current = true;

    setOpenStatus(
      produce(draft => {
        // 다른 dropdown은 닫기
        Object.keys(draft).forEach(key => {
          draft[key] = false;
        });
        draft[id] = true;
      })
    );
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (ignoreCloseOnceRef.current) {
      ignoreCloseOnceRef.current = false;
      return;
    }

    closeAll();
  }, [closeAll]);

  const close = useCallback((id: string) => {
    setOpenStatus(
      produce(draft => {
        draft[id] = false;
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      openStatus,
      open,
      close,
      closeAll,
    }),
    [close, closeAll, open, openStatus]
  );

  return (
    <DropdownContext.Provider value={value}>
      <View className="flex-1" onTouchEnd={handleTouchEnd}>
        {children}
      </View>
    </DropdownContext.Provider>
  );
}
