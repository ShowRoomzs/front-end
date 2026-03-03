import BottomSheetRenderer from "@/common/components/BottomSheet/BottomSheetRenderer";
import ModalRenderer from "@/common/components/Modal/ModalRenderer";
import ToastRenderer from "@/common/components/Toast/ToastRenderer";
import TooltipRenderer from "@/common/components/Tooltip/TooltipRenderer";

export default function PortalHost() {
  return (
    <>
      <TooltipRenderer />
      <BottomSheetRenderer />
      <ModalRenderer />
      <ToastRenderer />
    </>
  );
}
