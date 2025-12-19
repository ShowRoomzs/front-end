import BottomSheetRenderer from "@/common/components/BottomSheet/BottomSheetRenderer";
import TooltipRenderer from "@/common/components/Tooltip/TooltipRenderer";

export default function OverlayHost() {
  return (
    <>
      <TooltipRenderer />
      <BottomSheetRenderer />
      {/* TODO : Modal, BottomSheet, Toast renderer 추가 */}
    </>
  );
}
