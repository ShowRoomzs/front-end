import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, useMemo } from "react";

import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

import { SHEET_ENTER_TIMING } from "@/common/constants/motion";

export type SnapPoint = string | number;
export interface BottomSheetProps extends Omit<BottomSheetModalProps, "snapPoints"> {
  children: ReactNode;
  snapPoints?: Array<SnapPoint>;
}

/**
 * 디자인 시스템 05 · 08 — 상단 R8 · 핸들 36×4 #DEDEE0(위 10 · 아래 12) · 딤 40%.
 * 아래에서 280ms spring으로 올라오고, 닫을 때는 BottomSheetProvider가 220ms exit를 넘긴다.
 */
const DEFAULT_BOTTOM_SHEET_PROPS = {
  enableDynamicSizing: false,
  snapPoints: ["100%"],
  animationConfigs: SHEET_ENTER_TIMING,
  backgroundStyle: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  handleStyle: { paddingTop: 10, paddingBottom: 12 },
  backdropComponent: (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.4}
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
        backgroundColor: "#DEDEE0",
        width: 36,
        height: 4,
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
