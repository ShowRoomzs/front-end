import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
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
      opacity={0.8}
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
    <BottomSheetModal
      // eslint-disable-next-line react-native/no-color-literals
      handleIndicatorStyle={{
        backgroundColor: "#E1E1E5",
        width: 30,
        height: 3,
      }}
      ref={ref}
      {...bottomSheetProps}
    >
      {children}
    </BottomSheetModal>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
