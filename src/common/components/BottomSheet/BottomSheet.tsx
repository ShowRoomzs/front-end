import { BottomSheetModal, BottomSheetModalProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode } from "react";
import { useSharedValue } from "react-native-reanimated";

import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

export interface BottomSheetProps extends BottomSheetModalProps {
  children: ReactNode;
  syncSceneScaleWithWindow?: boolean;
}

const DEFAULT_BOTTOM_SHEET_PROPS: Partial<BottomSheetModalProps> = {
  enableDynamicSizing: false,
};

const BottomSheet = forwardRef<BottomSheetModalMethods, BottomSheetProps>((props, ref) => {
  const { children, ...bottomSheetProps } = props;

  const animatedPosition = useSharedValue(0);

  // TODO : default style 정의
  return (
    <BottomSheetModal
      animatedPosition={animatedPosition}
      ref={ref}
      {...DEFAULT_BOTTOM_SHEET_PROPS}
      {...bottomSheetProps}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
