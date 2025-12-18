import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
  useBottomSheetModalInternal,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, useMemo } from "react";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

import { getMinHeight } from "./config";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/src/types";

import { useOverlay } from "@/common/providers/OverlayProvider";

export type SnapPoint = string | number;
export interface BottomSheetProps extends Omit<BottomSheetModalProps, "snapPoints"> {
  children: ReactNode;
  // 해당 옵션 활성화 시 layout scale이 bottom sheet 높이에 따라 변경됩니다.
  // bottom sheet range(0 ~ 1) -> layout scale range(1 ~ 0.9)
  syncSceneScaleWithWindow?: boolean;
  snapPoints?: Array<SnapPoint>;
}

const DEFAULT_BOTTOM_SHEET_PROPS = {
  enableDynamicSizing: false,
  snapPoints: ["100%"],
} satisfies Partial<BottomSheetModalProps>;

const BottomSheet = forwardRef<BottomSheetModalMethods, BottomSheetProps>((props, ref) => {
  const { children, syncSceneScaleWithWindow, ...originBottomSheetProps } = props;
  const bottomSheetProps = useMemo(() => {
    return {
      ...DEFAULT_BOTTOM_SHEET_PROPS,
      ...originBottomSheetProps,
    };
  }, [originBottomSheetProps]);

  const { scale: overlayScale } = useOverlay();
  const { containerLayoutState } = useBottomSheetModalInternal();
  const animatedPosition = useSharedValue(0);

  const maxHeight = useMemo(() => containerLayoutState.value.height, [containerLayoutState.value.height]);
  const minHeight = useMemo(
    () => getMinHeight(bottomSheetProps.snapPoints[0], maxHeight),
    [bottomSheetProps.snapPoints, maxHeight]
  );

  useAnimatedReaction(
    () => animatedPosition.value,
    currentPosition => {
      if (maxHeight === -999 || currentPosition === 0 || !syncSceneScaleWithWindow) {
        return;
      }

      const progress = Math.min((maxHeight - currentPosition) / (maxHeight - minHeight), 1);

      const scale = 1 - progress * 0.1;

      if (overlayScale) {
        overlayScale.value = scale;
      }
    }
  );

  return (
    <BottomSheetModal animatedPosition={animatedPosition} ref={ref} {...bottomSheetProps}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
});

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
