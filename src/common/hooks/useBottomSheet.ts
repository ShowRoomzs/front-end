import { ReactNode, useEffect, useMemo } from "react";

import { useBottomSheetContext } from "../providers/BottomSheetProvider";

import { BottomSheetProps } from "@/common/components/BottomSheet/BottomSheet";

interface UseBottomSheetProps {
  id: string;
  render: () => ReactNode;
  sheetProps?: Partial<BottomSheetProps>;
}

export function useBottomSheet(props: UseBottomSheetProps) {
  const { id, render, sheetProps } = props;

  const { register, unregister, open, close } = useBottomSheetContext();

  useEffect(() => {
    register(id, { render, sheetProps });
    return () => unregister(id);
  }, [id, register, render, sheetProps, unregister]);

  return useMemo(
    () => ({
      open: () => open(id),
      close: close,
    }),
    [close, id, open]
  );
}
