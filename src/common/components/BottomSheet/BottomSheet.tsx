import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, useMemo } from "react";

import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

export type SnapPoint = string | number;
export interface BottomSheetProps extends Omit<BottomSheetModalProps, "snapPoints"> {
  children: ReactNode;
  snapPoints?: Array<SnapPoint>;
}

const DEFAULT_BOTTOM_SHEET_PROPS = {
  enableDynamicSizing: false,
  snapPoints: ["100%"],
  backdropComponent: (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.5}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  ),
} satisfies Partial<BottomSheetModalProps>;

const BottomSheet = forwardRef<BottomSheetModalMethods, BottomSheetProps>((props, ref) => {
  const { children, ...originBottomSheetProps } = props;
  const bottomSheetProps = useMemo(() => {
    return {
      ...DEFAULT_BOTTOM_SHEET_PROPS,
      ...originBottomSheetProps,
    };
  }, [originBottomSheetProps]);

  return (
    <BottomSheetModal ref={ref} {...bottomSheetProps}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
