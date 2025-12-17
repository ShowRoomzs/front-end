import BottomSheet from "./BottomSheet";

import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";

export default function BottomSheetRenderer() {
  const { activeSheetId, sheetRef, registry } = useBottomSheetContext();

  const item = activeSheetId ? registry.get(activeSheetId) : null;

  return (
    <BottomSheet ref={sheetRef} {...item?.sheetProps}>
      {item?.render()}
    </BottomSheet>
  );
}
