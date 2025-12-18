import BottomSheetRenderer from "../BottomSheet/BottomSheetRenderer";
import TooltipRenderer from "../Tooltip/TooltipRenderer";

export default function OverlayHost() {
  return (
    <>
      <TooltipRenderer />
      <BottomSheetRenderer />
      {/* TODO : Modal, BottomSheet, Toast renderer 추가 */}
    </>
  );
}
