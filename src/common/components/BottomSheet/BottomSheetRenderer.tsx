import { useMemo } from "react";

import BottomSheet from "@/common/components/BottomSheet/BottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";

export default function BottomSheetRenderer() {
  const { activeSheetId, sheetRef, registry } = useBottomSheetContext();

  const item = useMemo(() => (activeSheetId ? registry.get(activeSheetId) : null), [activeSheetId, registry]);

  return (
    <BottomSheet ref={sheetRef} {...item?.sheetProps}>
      {item?.render}
    </BottomSheet>
  );
}
