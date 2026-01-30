import BottomSheetRenderer from "@/common/components/BottomSheet/BottomSheetRenderer";
import ToastRenderer from "@/common/components/Toast/ToastRenderer";
import TooltipRenderer from "@/common/components/Tooltip/TooltipRenderer";

export default function PortalHost() {
  return (
    <>
      {/* TODO : Modal Renderer추가 */}
      <TooltipRenderer />
      <BottomSheetRenderer />
      <ToastRenderer />
    </>
  );
}
