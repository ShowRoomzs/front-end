import { cloneElement, ReactElement, useCallback, useMemo } from "react";

import BottomSheet, { BottomSheetProps } from "@/common/components/BottomSheet/BottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";

export default function BottomSheetRenderer() {
  const { activeSheetId, sheetRef, registry, open, close, onSheetChange } = useBottomSheetContext();

  const item = useMemo(() => (activeSheetId ? registry.get(activeSheetId) : null), [activeSheetId, registry]);

  const api: SheetApi = useMemo(
    () => ({
      open: () => activeSheetId && open(activeSheetId),
      close: close,
      isOpen: !!activeSheetId,
    }),
    [activeSheetId, open, close]
  );

  // render 컴포넌트에 sheetApi 전달
  const renderedContent = useMemo(() => {
    if (!item?.render) {
      return null;
    }
    return cloneElement(item.render as ReactElement, { sheetApi: api } as unknown as ReactElement);
  }, [item?.render, api]);

  const sheetOnChange = item?.sheetProps?.onChange;
  const handleChange = useCallback<NonNullable<BottomSheetProps["onChange"]>>(
    (index, position, type) => {
      onSheetChange(index);
      sheetOnChange?.(index, position, type);
    },
    [onSheetChange, sheetOnChange]
  );

  return (
    <BottomSheet ref={sheetRef} {...item?.sheetProps} onChange={handleChange}>
      {renderedContent}
    </BottomSheet>
  );
}
